import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all expenses for the authenticated user
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.usuario.findFirst({
      where: { email: user.emailAddresses[0]?.emailAddress }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const gastos = await prisma.gasto.findMany({
      where: {
        usuario_id: dbUser.id
      },
      include: {
        categoria: true
      }
    });

    return NextResponse.json(gastos);
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Error fetching expenses', details: error.message }, { status: 500 });
  }
}

// POST new expense
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { monto, fecha, descripcion, categoria_id, factura, metodo_pago } = body;

    // Primero, verificar si el usuario existe en la base de datos
    let dbUser = await prisma.usuario.findFirst({
      where: { email: user.emailAddresses[0]?.emailAddress }
    });

    // Si el usuario no existe, crearlo
    if (!dbUser) {
      dbUser = await prisma.usuario.create({
        data: {
          nombre: user.firstName || 'Usuario',
          email: user.emailAddresses[0]?.emailAddress || 'usuario@example.com',
          moneda_preferida: 'USD' // Valor por defecto
        }
      });
    }

    console.log('Creating expense with data:', {
      usuario_id: dbUser.id,
      monto,
      fecha: new Date(fecha),
      descripcion,
      categoria_id: categoria_id ? parseInt(categoria_id) : null,
      factura,
      metodo_pago
    });

    const gasto = await prisma.gasto.create({
      data: {
        usuario: {
          connect: {
            id: dbUser.id
          }
        },
        monto,
        fecha: new Date(fecha),
        descripcion,
        factura,
        metodo_pago,
        ...(categoria_id ? {
          categoria: {
            connect: {
              id: parseInt(categoria_id)
            }
          }
        } : {})
      }
    });

    return NextResponse.json(gasto);
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ 
      error: 'Error creating expense', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
} 