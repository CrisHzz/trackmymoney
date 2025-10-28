import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stringToDateForDB } from '@/lib/dateUtils';

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

// GET single income
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateDevUser();

    const ingreso = await prisma.ingreso.findUnique({
      where: {
        id: parseInt(params.id),
        usuario_id: user.id
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
    const user = await getOrCreateDevUser();

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
        usuario_id: user.id
      },
      data: {
        monto,
        fecha: stringToDateForDB(fecha),
        descripcion,
        categoria_id: categoria_id ? parseInt(categoria_id) : null,
        tipo_ingreso,
        recurrente,
        frecuencia,
        fecha_fin: fecha_fin ? stringToDateForDB(fecha_fin) : null
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
    const user = await getOrCreateDevUser();
    console.log('Current user for DELETE:', user);

    console.log('Deleting income:', {
      id: parseInt(params.id),
      usuario_id: user.id
    });

    await prisma.ingreso.delete({
      where: {
        id: parseInt(params.id),
        usuario_id: user.id
      }
    });

    return NextResponse.json({ message: 'Income deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ 
      error: 'Error deleting income', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
} 