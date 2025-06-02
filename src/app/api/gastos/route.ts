import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { stringToDateForDB } from '@/lib/dateUtils';

const prisma = new PrismaClient();

// GET all expenses for the authenticated user
export async function GET() {
  try {
    console.log('🔍 Iniciando GET /api/gastos');
    
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

    console.log('🔍 Buscando gastos...');
    const gastos = await prisma.gasto.findMany({
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

    console.log('💰 Gastos encontrados:', gastos.length);
    return NextResponse.json(gastos);
  } catch (error: any) {
    console.error('❌ Error obteniendo gastos:', error);
    return NextResponse.json({ 
      error: 'Error fetching expenses', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST new expense
export async function POST(request: Request) {
  try {
    console.log('📝 Iniciando POST /api/gastos');
    
    const user = await currentUser();
    
    if (!user) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📋 Datos recibidos:', body);
    
    const { monto, fecha, descripcion, categoria_id, factura, metodo_pago } = body;

    // Validaciones
    if (!monto || !fecha) {
      return NextResponse.json({ 
        error: 'Monto y fecha son requeridos' 
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

    console.log('💰 Creando gasto...');
    console.log('📅 Fecha original:', fecha);
    console.log('📅 Fecha convertida:', stringToDateForDB(fecha));
    
    const gasto = await prisma.gasto.create({
      data: {
        usuario_id: dbUser.id,
        monto: parseFloat(monto),
        fecha: stringToDateForDB(fecha),
        descripcion: descripcion || null,
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        factura: factura || false,
        metodo_pago: metodo_pago || null
      },
      include: {
        categoria: true
      }
    });

    console.log('✅ Gasto creado:', gasto.id);
    return NextResponse.json(gasto);
  } catch (error: any) {
    console.error('❌ Error creando gasto:', error);
    return NextResponse.json({ 
      error: 'Error creating expense', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
} 