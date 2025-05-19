import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all income for the authenticated user
export async function GET() {
  try {
    const user = await currentUser();
    console.log('Current user:', user);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar el usuario por email en lugar de ID
    const dbUser = await prisma.usuario.findFirst({
      where: { 
        email: user.emailAddresses[0]?.emailAddress 
      }
    });

    if (!dbUser) {
      console.log('User not found in database, creating new user');
      // Crear el usuario si no existe
      const newUser = await prisma.usuario.create({
        data: {
          nombre: user.firstName || 'Usuario',
          email: user.emailAddresses[0]?.emailAddress || 'usuario@example.com',
          moneda_preferida: 'USD'
        }
      });
      return NextResponse.json([]); // Retornar array vacío para nuevo usuario
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
    return NextResponse.json({ 
      error: 'Error fetching income', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

// POST new income
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    console.log('Current user for POST:', user);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
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

    // Buscar el usuario por email
    let dbUser = await prisma.usuario.findFirst({
      where: { 
        email: user.emailAddresses[0]?.emailAddress 
      }
    });

    // Si el usuario no existe, crearlo
    if (!dbUser) {
      console.log('Creating new user for POST');
      dbUser = await prisma.usuario.create({
        data: {
          nombre: user.firstName || 'Usuario',
          email: user.emailAddresses[0]?.emailAddress || 'usuario@example.com',
          moneda_preferida: 'USD'
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
        monto: parseFloat(monto),
        fecha: new Date(fecha),
        descripcion,
        tipo_ingreso,
        recurrente: recurrente || false,
        frecuencia: frecuencia || null,
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
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
} 