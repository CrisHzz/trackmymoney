import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Comenzando seed de datos...')

  // Crear categorías por defecto para gastos
  const categoriasGastos = [
    'Alimentación',
    'Transporte',
    'Vivienda',
    'Salud',
    'Entretenimiento',
    'Ropa',
    'Educación',
    'Servicios',
    'Tecnología',
    'Otros Gastos'
  ]

  // Crear categorías por defecto para ingresos
  const categoriasIngresos = [
    'Salario',
    'Freelance',
    'Inversiones',
    'Bonos',
    'Renta',
    'Ventas',
    'Otros Ingresos'
  ]

  // Combinar todas las categorías
  const todasCategorias = [...categoriasGastos, ...categoriasIngresos]

  for (const nombreCategoria of todasCategorias) {
    await prisma.categoria.upsert({
      where: { nombre: nombreCategoria },
      update: {},
      create: {
        nombre: nombreCategoria
      }
    })
  }

  console.log('✅ Categorías inicializadas correctamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 