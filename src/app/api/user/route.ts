import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Usuario de desarrollo para modo sin Clerk
const DEV_USER_EMAIL = 'dev@trackmymoney.com';

// Función para obtener o crear usuario de desarrollo
async function getOrCreateDevUser() {
  let user = await prisma.usuario.findUnique({
    where: { email: DEV_USER_EMAIL }
  });

  if (!user) {
    user = await prisma.usuario.create({
      data: {
        email: DEV_USER_EMAIL,
        nombre: 'Usuario de Desarrollo',
        moneda_preferida: 'USD'
      }
    });
  }

  return user;
}

export async function GET() {
  try {
    // Obtener usuario de desarrollo
    const dbUser = await getOrCreateDevUser();

    return NextResponse.json({ id: dbUser.id });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
} 