/**
 * Pruebas unitarias para gestión de categorías
 */

import assert from 'assert';

// Interfaces para categorías
interface Usuario {
  id: number;
  email: string;
  clerk_id: string;
  activo: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
  usuario_id: number;
  activa: boolean;
  fecha_creacion: string;
}

interface CategoriaInput {
  nombre: string;
  usuario_id: number;
}

interface GetCategoriesResponse {
  success: boolean;
  categories: Categoria[];
  message?: string;
  count: number;
}

interface CreateCategoryResponse {
  success: boolean;
  category?: Categoria;
  message?: string;
}

// Base de datos simulada
let mockCategories: Categoria[] = [];
let nextCategoryId = 1;

// Función para obtener categorías del usuario
export const getUserCategories = (usuario: Usuario): GetCategoriesResponse => {
  
  if (!usuario || !usuario.clerk_id) {
    return {
      success: false,
      categories: [],
      message: 'Usuario no autenticado',
      count: 0
    };
  }

  if (!usuario.activo) {
    return {
      success: false,
      categories: [],
      message: 'Usuario inactivo',
      count: 0
    };
  }

  const categoriasUsuario = mockCategories.filter(
    categoria => categoria.usuario_id === usuario.id && categoria.activa
  );

  const categoriasOrdenadas = categoriasUsuario.sort((a, b) => 
    a.nombre.localeCompare(b.nombre)
  );

  return {
    success: true,
    categories: categoriasOrdenadas,
    message: categoriasOrdenadas.length === 0 ? 'No hay categorías registradas' : undefined,
    count: categoriasOrdenadas.length
  };
};

// Función para crear nueva categoría
export const createCategory = (
  categoriaInput: CategoriaInput,
  usuario: Usuario
): CreateCategoryResponse => {
  
  if (!usuario || !usuario.clerk_id) {
    return {
      success: false,
      message: 'Usuario no autenticado'
    };
  }

  if (!categoriaInput.nombre || categoriaInput.nombre.trim() === '') {
    return {
      success: false,
      message: 'El nombre de la categoría es obligatorio'
    };
  }

  const nombreLimpio = categoriaInput.nombre.trim();
  
  if (nombreLimpio.length > 50) {
    return {
      success: false,
      message: 'El nombre de la categoría no puede exceder 50 caracteres'
    };
  }

  if (categoriaInput.usuario_id !== usuario.id) {
    return {
      success: false,
      message: 'Usuario no autorizado para crear esta categoría'
    };
  }

  const categoriaExistente = mockCategories.find(
    categoria => 
      categoria.nombre.toLowerCase() === nombreLimpio.toLowerCase() &&
      categoria.usuario_id === usuario.id &&
      categoria.activa
  );

  if (categoriaExistente) {
    return {
      success: false,
      message: 'Ya existe una categoría con este nombre'
    };
  }

  const nuevaCategoria: Categoria = {
    id: nextCategoryId++,
    nombre: nombreLimpio,
    usuario_id: usuario.id,
    activa: true,
    fecha_creacion: new Date().toISOString()
  };

  mockCategories.push(nuevaCategoria);

  return {
    success: true,
    category: nuevaCategoria,
    message: 'Categoría creada exitosamente'
  };
};

// Funciones auxiliares para testing
export const clearMockCategories = () => {
  mockCategories = [];
  nextCategoryId = 1;
};

export const addMockCategory = (categoria: Omit<Categoria, 'id'>) => {
  const nuevaCategoria = { ...categoria, id: nextCategoryId++ };
  mockCategories.push(nuevaCategoria);
  return nuevaCategoria;
};

// Función helper para simular describe/test
function describe(suiteName: string, fn: () => void) {
  console.log(`\n🧪 Suite: ${suiteName}`);
  fn();
}

function test(testName: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${testName}`);
  } catch (error) {
    console.log(`  ❌ ${testName}`);
    console.error(`     Error: ${error.message}`);
    // No re-lanzar el error para permitir que continúen otros tests
  }
}

// Helper functions para reemplazar expect
function expect(actual: any) {
  return {
    toBe: (expected: any) => assert.strictEqual(actual, expected),
    toEqual: (expected: any) => assert.deepStrictEqual(actual, expected),
    toHaveLength: (length: number) => assert.strictEqual(actual.length, length),
    toBeDefined: () => assert.notStrictEqual(actual, undefined)
  };
}

// Función principal de testing
function runTests() {
  describe('CP009 – GetCategory', () => {
    let mockUser: Usuario;

    const setupMockData = () => {
      clearMockCategories();
      
      mockUser = {
        id: 1,
        email: 'test@example.com',
        clerk_id: 'clerk_123',
        activo: true
      };

      // Agregar categorías de prueba
      addMockCategory({
        nombre: 'Transporte',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-15T10:00:00Z'
      });
      
      addMockCategory({
        nombre: 'Alimentación',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-16T10:00:00Z'
      });
    };

    // Test de Caja Blanca: Verifica el filtrado interno por usuario_id y estado activa
    test('debe listar categorías del usuario autenticado', () => {
      setupMockData();
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(2);
      expect(result.count).toBe(2);
      assert.ok(result.categories.every(cat => cat.usuario_id === 1));
    });

    // Test de Caja Negra: Verifica control de acceso sin revisar implementación
    test('debe rechazar usuario no autenticado', () => {
      setupMockData();
      // Arrange
      const usuarioNoAuth = null as any;

      // Act
      const result = getUserCategories(usuarioNoAuth);

      // Assert
      expect(result.success).toBe(false);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('Usuario no autenticado');
      expect(result.count).toBe(0);
    });

    // Test de Caja Blanca: Verifica la lógica interna de ordenamiento alfabético
    test('debe ordenar categorías alfabéticamente', () => {
      setupMockData();
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories[0].nombre).toBe('Alimentación');
      expect(result.categories[1].nombre).toBe('Transporte');
    });

    // Test de Caja Negra: Verifica comportamiento con datos vacíos
    test('debe manejar usuario sin categorías', () => {
      // Arrange
      clearMockCategories();
      
      const mockUserEmpty = {
        id: 1,
        email: 'test@example.com',
        clerk_id: 'clerk_123',
        activo: true
      };
      
      // Act
      const result = getUserCategories(mockUserEmpty);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('No hay categorías registradas');
      expect(result.count).toBe(0);
    });
  });

  describe('CP010 – CreateCategory', () => {
    let mockUser: Usuario;

    const setupMockData = () => {
      clearMockCategories();
      
      mockUser = {
        id: 1,
        email: 'test@example.com',
        clerk_id: 'clerk_123',
        activo: true
      };

      // Agregar categoría existente
      addMockCategory({
        nombre: 'Alimentación',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-15T10:00:00Z'
      });
    };

    // Test de Caja Negra: Verifica creación exitosa sin revisar implementación
    test('debe crear categoría con nombre válido', () => {
      setupMockData();
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Nueva Categoría',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category).toBeDefined();
      expect(result.category?.nombre).toBe('Nueva Categoría');
      expect(result.category?.usuario_id).toBe(1);
      expect(result.message).toBe('Categoría creada exitosamente');
    });

    // Test de Caja Negra: Verifica validación de entrada sin revisar lógica interna
    test('debe rechazar nombre vacío', () => {
      setupMockData();
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: '',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('El nombre de la categoría es obligatorio');
    });

    // Test de Caja Blanca: Verifica la lógica interna de detección de duplicados
    test('debe rechazar nombre duplicado', () => {
      setupMockData();
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Alimentación', // Ya existe
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Ya existe una categoría con este nombre');
    });

    // Test de Caja Negra: Verifica validación de longitud máxima
    test('debe validar longitud máxima del nombre', () => {
      setupMockData();
      // Arrange
      const nombreMuyLargo = 'A'.repeat(51); // 51 caracteres
      const categoriaInput: CategoriaInput = {
        nombre: nombreMuyLargo,
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('El nombre de la categoría no puede exceder 50 caracteres');
    });

    // Test de Caja Negra: Verifica autorización de usuario
    test('debe rechazar usuario no autorizado', () => {
      setupMockData();
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Nueva Categoría',
        usuario_id: 999 // ID diferente al del usuario
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario no autorizado para crear esta categoría');
    });

    // Test de Caja Blanca: Verifica manejo de espacios en blanco
    test('debe limpiar espacios en blanco del nombre', () => {
      setupMockData();
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: '  Nueva Categoría Con Espacios  ',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category?.nombre).toBe('Nueva Categoría Con Espacios');
    });
  });
}

// Ejecutar las pruebas
runTests();

export { runTests };