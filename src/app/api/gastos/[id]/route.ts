import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEV_USER_EMAIL = 'dev@trackmymoney.com';

async function getOrCreateDevUser() {
  let user = await prisma.usuario.findFirst({
    where: { email: DEV_USER_EMAIL }
  });

  if (!user) {
    user = await prisma.usuario.create({
      data: {
        email: DEV_USER_EMAIL,
        nombre: 'Dev User',
        moneda_preferida: 'USD'
      }
    });
  }

  return user;
}

// GET single expense
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateDevUser();

    const gasto = await prisma.gasto.findUnique({
      where: {
        id: parseInt(params.id),
        usuario_id: user.id
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
    const user = await getOrCreateDevUser();

    const body = await request.json();
    const { monto, fecha, descripcion, categoria_id, factura, metodo_pago } = body;

    const gasto = await prisma.gasto.update({
      where: {
        id: parseInt(params.id),
        usuario_id: user.id
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
    const user = await getOrCreateDevUser();
    console.log('Current user for DELETE:', user);

    console.log('Deleting expense:', {
      id: parseInt(params.id),
      usuario_id: user.id
    });

    await prisma.gasto.delete({
      where: {
        id: parseInt(params.id),
        usuario_id: user.id
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