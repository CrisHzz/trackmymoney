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

    const gasto = await prisma.gasto.findUnique({
      where: {
        id: parseInt(params.id),
        usuario_id: parseInt(user.id)
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

    const body = await request.json();
    const { monto, fecha, descripcion, categoria_id, factura, metodo_pago } = body;

    const gasto = await prisma.gasto.update({
      where: {
        id: parseInt(params.id),
        usuario_id: parseInt(user.id)
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
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.gasto.delete({
      where: {
        id: parseInt(params.id),
        usuario_id: parseInt(user.id)
      }
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting expense' }, { status: 500 });
  }
} 