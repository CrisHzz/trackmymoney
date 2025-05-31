import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all categories
export async function GET() {
  try {
    console.log('🔍 Obteniendo categorías...');
    
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    console.log('📂 Categorías encontradas:', categorias.length);
    return NextResponse.json(categorias);
  } catch (error: any) {
    console.error('❌ Error obteniendo categorías:', error);
    return NextResponse.json({ 
      error: 'Error fetching categories', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre
      }
    });

    console.log('✅ Categoría creada:', categoria);
    return NextResponse.json(categoria);
  } catch (error: any) {
    console.error('❌ Error creando categoría:', error);
    return NextResponse.json({ 
      error: 'Error creating category', 
      details: error.message 
    }, { status: 500 });
  }
} 