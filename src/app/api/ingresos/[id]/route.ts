import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single income
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ingreso = await prisma.ingreso.findUnique({
      where: {
        id: parseInt(params.id),
        usuario_id: parseInt(user.id)
      },
      include: {
        categoria: true
      }
    });

    if (!ingreso) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }

    return NextResponse.json(ingreso);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching income' }, { status: 500 });
  }
}

// PUT update income
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

    const ingreso = await prisma.ingreso.update({
      where: {
        id: parseInt(params.id),
        usuario_id: parseInt(user.id)
      },
      data: {
        monto,
        fecha: new Date(fecha),
        descripcion,
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        tipo_ingreso,
        recurrente,
        frecuencia,
        fecha_fin: fecha_fin ? new Date(fecha_fin) : null
      }
    });

    return NextResponse.json(ingreso);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating income' }, { status: 500 });
  }
}

// DELETE income
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.ingreso.delete({
      where: {
        id: parseInt(params.id),
        usuario_id: parseInt(user.id)
      }
    });

    return NextResponse.json({ message: 'Income deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting income' }, { status: 500 });
  }
} 