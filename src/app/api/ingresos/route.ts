import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all income for the authenticated user
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.usuario.findUnique({
      where: { id: parseInt(user.id) }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const ingresos = await prisma.ingreso.findMany({
      where: {
        usuario_id: dbUser.id
      },
      include: {
        categoria: true
      }
    });

    return NextResponse.json(ingresos);
  } catch (error: any) {
    console.error('Error fetching income:', error);
    return NextResponse.json({ error: 'Error fetching income', details: error.message }, { status: 500 });
  }
}

// POST new income
export async function POST(request: Request) {
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

    // Primero, verificar si el usuario existe en la base de datos
    let dbUser = await prisma.usuario.findUnique({
      where: { id: parseInt(user.id) }
    });

    // Si el usuario no existe, crearlo
    if (!dbUser) {
      dbUser = await prisma.usuario.create({
        data: {
          id: parseInt(user.id),
          nombre: user.firstName || 'Usuario',
          email: user.emailAddresses[0]?.emailAddress || 'usuario@example.com',
          moneda_preferida: 'USD' // Valor por defecto
        }
      });
    }

    console.log('Creating income with data:', {
      usuario_id: dbUser.id,
      monto,
      fecha: new Date(fecha),
      descripcion,
      categoria_id: categoria_id ? parseInt(categoria_id) : null,
      tipo_ingreso,
      recurrente,
      frecuencia,
      fecha_fin: fecha_fin ? new Date(fecha_fin) : null
    });

    const ingreso = await prisma.ingreso.create({
      data: {
        usuario: {
          connect: {
            id: dbUser.id
          }
        },
        monto,
        fecha: new Date(fecha),
        descripcion,
        tipo_ingreso,
        recurrente,
        frecuencia,
        fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
        ...(categoria_id ? {
          categoria: {
            connect: {
              id: parseInt(categoria_id)
            }
          }
        } : {})
      }
    });

    return NextResponse.json(ingreso);
  } catch (error: any) {
    console.error('Error creating income:', error);
    return NextResponse.json({ 
      error: 'Error creating income', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
} 