import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single expense
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.usuario.findFirst({
      where: { 
        email: user.emailAddresses[0]?.emailAddress 
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const gasto = await prisma.gasto.findUnique({
      where: {
        id: parseInt(params.id),
        usuario_id: dbUser.id
      },
      include: {
        categoria: true
      }
    });

    if (!gasto) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(gasto);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching expense' }, { status: 500 });
  }
}

// PUT update expense
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.usuario.findFirst({
      where: { 
        email: user.emailAddresses[0]?.emailAddress 
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { monto, fecha, descripcion, categoria_id, factura, metodo_pago } = body;

    const gasto = await prisma.gasto.update({
      where: {
        id: parseInt(params.id),
        usuario_id: dbUser.id
      },
      data: {
        monto,
        fecha: new Date(fecha),
        descripcion,
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        factura,
        metodo_pago
      }
    });

    return NextResponse.json(gasto);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating expense' }, { status: 500 });
  }
}

// DELETE expense
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    console.log('Current user for DELETE:', user);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar el usuario por email
    const dbUser = await prisma.usuario.findFirst({
      where: { 
        email: user.emailAddresses[0]?.emailAddress 
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Deleting expense:', {
      id: parseInt(params.id),
      usuario_id: dbUser.id
    });

    await prisma.gasto.delete({
      where: {
        id: parseInt(params.id),
        usuario_id: dbUser.id
      }
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ 
      error: 'Error deleting expense', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
} 