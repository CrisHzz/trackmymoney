import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { stringToDateForDB } from '@/lib/dateUtils';

const prisma = new PrismaClient();


// GET all income for the authenticated user
export async function GET() {
  try {
    console.log('🔍 Iniciando GET /api/ingresos');
    
    const user = await currentUser();
    console.log('👤 Usuario actual:', user?.id);
    
    if (!user) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    console.log('📧 Email del usuario:', userEmail);

    if (!userEmail) {
      console.log('❌ Email no encontrado');
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    console.log('🔍 Buscando usuario en BD...');
    const dbUser = await prisma.usuario.findFirst({
      where: { email: userEmail }
    });

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
    console.log('📝 Iniciando POST /api/ingresos');
    
    const user = await currentUser();
    
    if (!user) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 });
    }

    // Buscar o crear usuario
    let dbUser = await prisma.usuario.findFirst({
      where: { email: userEmail }
    });

    if (!dbUser) {
      console.log('👤 Creando nuevo usuario...');
      dbUser = await prisma.usuario.create({
        data: {
          nombre: user.firstName || 'Usuario',
          email: userEmail,
          moneda_preferida: 'USD'
        }
      });
    }

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