import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { stringToDateForDB } from '@/lib/dateUtils';

const prisma = new PrismaClient();

// Usuario de desarrollo para modo sin Clerk
const DEV_USER_EMAIL = 'dev@trackmymoney.com';

// Función para obtener o crear usuario de desarrollo
async function getOrCreateDevUser() {
  let user = await prisma.usuario.findUnique({
    where: { email: DEV_USER_EMAIL }
  });

  if (!user) {
    user = await prisma.usuario.create({
      data: {
        email: DEV_USER_EMAIL,
        nombre: 'Usuario de Desarrollo',
        moneda_preferida: 'USD'
      }
    });
  }

  return user;
}

// GET all income for the authenticated user
export async function GET() {
  try {
    console.log('� Iniciando GET /api/ingresos (modo desarrollo)');
    
    // Obtener usuario de desarrollo
    const user = await getOrCreateDevUser();
    console.log('👤 Usuario de desarrollo:', user.id);

    console.log('🔍 Buscando ingresos en BD...');
    const dbUser = user;

    console.log('👤 Usuario en BD:', dbUser?.id);

    if (!dbUser) {
      console.log('⚠️ Usuario no encontrado en BD, devolviendo array vacío');
      return NextResponse.json([]);
    }

    console.log('🔍 Buscando ingresos...');
    const ingresos = await prisma.ingreso.findMany({
      where: {
        usuario_id: dbUser.id
      },
      include: {
        categoria: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    console.log('💵 Ingresos encontrados:', ingresos.length);
    return NextResponse.json(ingresos);
  } catch (error: any) {
    console.error('❌ Error obteniendo ingresos:', error);
    return NextResponse.json({ 
      error: 'Error fetching income', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST new income
export async function POST(request: Request) {
  try {
    console.log('📝 Iniciando POST /api/ingresos (modo desarrollo)');
    
    // Obtener usuario de desarrollo
    const user = await getOrCreateDevUser();
    
    if (!user) {
      console.log('❌ Error obteniendo usuario de desarrollo');
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }

    const body = await request.json();
    console.log('📋 Datos recibidos:', body);
    
    const { 
      monto, 
      fecha, 
      descripcion, 
      categoria_id, 
      tipo_ingreso, 
      recurrente, 
      frecuencia, 
      fecha_fin 
    } = body;

    // Validaciones
    if (!monto || !fecha || !tipo_ingreso) {
      return NextResponse.json({ 
        error: 'Monto, fecha y tipo de ingreso son requeridos' 
      }, { status: 400 });
    }

    const dbUser = user;

    // Validar categoría si se proporciona
    if (categoria_id) {
      const categoriaExiste = await prisma.categoria.findUnique({
        where: { id: parseInt(categoria_id) }
      });
      
      if (!categoriaExiste) {
        return NextResponse.json({ 
          error: 'Categoría no válida' 
        }, { status: 400 });
      }
    }

    console.log('💵 Creando ingreso...');
    console.log('📅 Fecha original:', fecha);
    console.log('📅 Fecha convertida:', stringToDateForDB(fecha));
    
    const ingreso = await prisma.ingreso.create({
      data: {
        usuario_id: dbUser.id,
        monto: parseFloat(monto),
        fecha: stringToDateForDB(fecha),
        descripcion: descripcion || null,
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        tipo_ingreso,
        recurrente: recurrente || false,
        frecuencia: frecuencia || null,
        fecha_fin: fecha_fin ? stringToDateForDB(fecha_fin) : null
      },
      include: {
        categoria: true
      }
    });

    console.log('✅ Ingreso creado:', ingreso.id);
    return NextResponse.json(ingreso);
  } catch (error: any) {
    console.error('❌ Error creando ingreso:', error);
    return NextResponse.json({ 
      error: 'Error creating income', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
} 