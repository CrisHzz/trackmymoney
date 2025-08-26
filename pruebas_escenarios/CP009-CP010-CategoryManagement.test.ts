/**
 * Pruebas unitarias para gestión de categorías
 * Escenarios: CP009 – GetCategory, CP010 – CreateCategory
 * Responsable: Jonathan
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

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

// Base de datos simulada de categorías
let mockCategories: Categoria[] = [];
let nextCategoryId = 1;

// Función para obtener categorías del usuario
export const getUserCategories = (usuario: Usuario): GetCategoriesResponse => {
  
  // Validar usuario autenticado
  if (!usuario || !usuario.clerk_id) {
    return {
      success: false,
      categories: [],
      message: 'Usuario no autenticado',
      count: 0
    };
  }

  // Validar usuario activo
  if (!usuario.activo) {
    return {
      success: false,
      categories: [],
      message: 'Usuario inactivo',
      count: 0
    };
  }

  // Filtrar categorías del usuario activo
  const categoriasUsuario = mockCategories.filter(
    categoria => categoria.usuario_id === usuario.id && categoria.activa
  );

  // Ordenar alfabéticamente
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
  
  // Validar usuario autenticado
  if (!usuario || !usuario.clerk_id) {
    return {
      success: false,
      message: 'Usuario no autenticado'
    };
  }

  // Validar usuario activo
  if (!usuario.activo) {
    return {
      success: false,
      message: 'Usuario inactivo'
    };
  }

  // Validar campos obligatorios
  if (!categoriaInput.nombre || categoriaInput.nombre.trim() === '') {
    return {
      success: false,
      message: 'El nombre de la categoría es obligatorio'
    };
  }

  // Validar longitud del nombre
  const nombreLimpio = categoriaInput.nombre.trim();
  if (nombreLimpio.length > 50) {
    return {
      success: false,
      message: 'El nombre de la categoría no puede exceder 50 caracteres'
    };
  }

  // Verificar que el usuario coincida con el input
  if (categoriaInput.usuario_id !== usuario.id) {
    return {
      success: false,
      message: 'Usuario no autorizado para crear esta categoría'
    };
  }

  // Verificar si el nombre ya existe para este usuario
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

  // Crear nueva categoría
  const nuevaCategoria: Categoria = {
    id: nextCategoryId++,
    nombre: nombreLimpio,
    usuario_id: usuario.id,
    activa: true,
    fecha_creacion: new Date().toISOString()
  };

  // Guardar en base de datos simulada
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

// Función para medir tiempo de respuesta
export const measureResponseTime = <T>(operation: () => T): { result: T; time: number } => {
  const startTime = performance.now();
  const result = operation();
  const endTime = performance.now();
  
  return {
    result,
    time: endTime - startTime
  };
};

describe('CP009 – GetCategory', () => {
  let mockUser: Usuario;

  beforeEach(() => {
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
    
    addMockCategory({
      nombre: 'Entretenimiento',
      usuario_id: 1,
      activa: true,
      fecha_creacion: '2024-01-17T10:00:00Z'
    });

    // Categoría de otro usuario
    addMockCategory({
      nombre: 'Categoría Otro Usuario',
      usuario_id: 2,
      activa: true,
      fecha_creacion: '2024-01-18T10:00:00Z'
    });

    // Categoría inactiva
    addMockCategory({
      nombre: 'Categoría Inactiva',
      usuario_id: 1,
      activa: false,
      fecha_creacion: '2024-01-19T10:00:00Z'
    });
  });

  describe('Autenticación y autorización', () => {
    test('debe listar categorías del usuario autenticado', () => {
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(3);
      expect(result.count).toBe(3);
      expect(result.categories.every(cat => cat.usuario_id === 1)).toBe(true);
    });

    test('debe rechazar usuario no autenticado', () => {
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

    test('debe rechazar usuario sin clerk_id', () => {
      // Arrange
      const usuarioSinClerkId = { ...mockUser, clerk_id: '' };

      // Act
      const result = getUserCategories(usuarioSinClerkId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('Usuario no autenticado');
    });

    test('debe rechazar usuario inactivo', () => {
      // Arrange
      const usuarioInactivo = { ...mockUser, activo: false };

      // Act
      const result = getUserCategories(usuarioInactivo);

      // Assert
      expect(result.success).toBe(false);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('Usuario inactivo');
    });
  });

  describe('Filtrado de categorías', () => {
    test('debe mostrar solo categorías activas', () => {
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories.every(cat => cat.activa)).toBe(true);
      expect(result.categories.find(cat => cat.nombre === 'Categoría Inactiva')).toBeUndefined();
    });

    test('debe mostrar solo categorías del usuario logueado', () => {
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories.every(cat => cat.usuario_id === mockUser.id)).toBe(true);
      expect(result.categories.find(cat => cat.nombre === 'Categoría Otro Usuario')).toBeUndefined();
    });

    test('debe ordenar categorías alfabéticamente', () => {
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(3);
      expect(result.categories[0].nombre).toBe('Alimentación');
      expect(result.categories[1].nombre).toBe('Entretenimiento');
      expect(result.categories[2].nombre).toBe('Transporte');
    });
  });

  describe('Casos sin categorías', () => {
    test('debe manejar usuario sin categorías', () => {
      // Arrange
      clearMockCategories();
      
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('No hay categorías registradas');
      expect(result.count).toBe(0);
    });

    test('debe manejar usuario nuevo sin categorías creadas', () => {
      // Arrange
      const usuarioNuevo = {
        id: 999,
        email: 'nuevo@example.com',
        clerk_id: 'clerk_999',
        activo: true
      };

      // Act
      const result = getUserCategories(usuarioNuevo);

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('No hay categorías registradas');
      expect(result.count).toBe(0);
    });
  });

  describe('Métricas y rendimiento', () => {
    test('debe responder en tiempo aceptable', () => {
      // Act
      const { result, time } = measureResponseTime(() => getUserCategories(mockUser));

      // Assert
      expect(result.success).toBe(true);
      expect(time).toBeLessThan(50); // Menos de 50ms
    });

    test('debe contar correctamente el número de categorías', () => {
      // Act
      const result = getUserCategories(mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.count).toBe(result.categories.length);
      expect(result.count).toBe(3);
    });

    test('debe manejar grandes volúmenes de categorías eficientemente', () => {
      // Arrange
      clearMockCategories();
      Array.from({ length: 1000 }, (_, i) => {
        addMockCategory({
          nombre: `Categoría ${i.toString().padStart(4, '0')}`,
          usuario_id: 1,
          activa: true,
          fecha_creacion: new Date().toISOString()
        });
      });

      // Act
      const { result, time } = measureResponseTime(() => getUserCategories(mockUser));

      // Assert
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(1000);
      expect(time).toBeLessThan(100); // Menos de 100ms incluso con 1000 categorías
    });
  });
});

describe('CP010 – CreateCategory', () => {
  let mockUser: Usuario;

  beforeEach(() => {
    clearMockCategories();
    
    mockUser = {
      id: 1,
      email: 'test@example.com',
      clerk_id: 'clerk_123',
      activo: true
    };

    // Agregar algunas categorías existentes
    addMockCategory({
      nombre: 'Alimentación',
      usuario_id: 1,
      activa: true,
      fecha_creacion: '2024-01-15T10:00:00Z'
    });
  });

  describe('Creación exitosa', () => {
    test('debe crear categoría con nombre válido', () => {
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
      expect(result.category?.activa).toBe(true);
      expect(result.category?.id).toBeDefined();
      expect(result.category?.fecha_creacion).toBeDefined();
      expect(result.message).toBe('Categoría creada exitosamente');
    });

    test('debe aparecer en la lista después de crearla', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Deportes',
        usuario_id: 1
      };

      // Act
      const createResult = createCategory(categoriaInput, mockUser);
      const getResult = getUserCategories(mockUser);

      // Assert
      expect(createResult.success).toBe(true);
      expect(getResult.success).toBe(true);
      expect(getResult.categories.find(cat => cat.nombre === 'Deportes')).toBeDefined();
      expect(getResult.count).toBe(2); // Alimentación + Deportes
    });

    test('debe limpiar espacios en blanco del nombre', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: '  Viajes  ',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category?.nombre).toBe('Viajes');
    });
  });

  describe('Validaciones de autenticación', () => {
    test('debe rechazar usuario no autenticado', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Test',
        usuario_id: 1
      };
      const usuarioNoAuth = null as any;

      // Act
      const result = createCategory(categoriaInput, usuarioNoAuth);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario no autenticado');
      expect(result.category).toBeUndefined();
    });

    test('debe rechazar usuario inactivo', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Test',
        usuario_id: 1
      };
      const usuarioInactivo = { ...mockUser, activo: false };

      // Act
      const result = createCategory(categoriaInput, usuarioInactivo);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario inactivo');
    });

    test('debe validar coincidencia de usuario_id', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Test',
        usuario_id: 999 // ID diferente al usuario
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario no autorizado para crear esta categoría');
    });
  });

  describe('Validaciones de campos', () => {
    test('debe rechazar nombre vacío', () => {
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

    test('debe rechazar nombre solo con espacios', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: '   ',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('El nombre de la categoría es obligatorio');
    });

    test('debe rechazar nombres muy largos', () => {
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

    test('debe aceptar nombres en el límite de 50 caracteres', () => {
      // Arrange
      const nombreLimite = 'A'.repeat(50); // Exactamente 50 caracteres
      const categoriaInput: CategoriaInput = {
        nombre: nombreLimite,
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category?.nombre).toBe(nombreLimite);
    });
  });

  describe('Validación de duplicados', () => {
    test('debe rechazar nombre duplicado exacto', () => {
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

    test('debe rechazar nombre duplicado con diferente capitalización', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'ALIMENTACIÓN',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Ya existe una categoría con este nombre');
    });

    test('debe rechazar nombre duplicado con espacios adicionales', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: '  Alimentación  ',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Ya existe una categoría con este nombre');
    });

    test('debe permitir mismo nombre para diferentes usuarios', () => {
      // Arrange
      const otroUsuario = {
        id: 2,
        email: 'otro@example.com',
        clerk_id: 'clerk_456',
        activo: true
      };
      
      const categoriaInput: CategoriaInput = {
        nombre: 'Alimentación', // Mismo nombre, diferente usuario
        usuario_id: 2
      };

      // Act
      const result = createCategory(categoriaInput, otroUsuario);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category?.nombre).toBe('Alimentación');
      expect(result.category?.usuario_id).toBe(2);
    });
  });

  describe('Métricas y rendimiento', () => {
    test('debe crear categoría en tiempo aceptable', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Velocidad Test',
        usuario_id: 1
      };

      // Act
      const { result, time } = measureResponseTime(() => 
        createCategory(categoriaInput, mockUser)
      );

      // Assert
      expect(result.success).toBe(true);
      expect(time).toBeLessThan(50); // Menos de 50ms
    });

    test('debe manejar creación masiva de categorías', () => {
      // Arrange & Act
      const startTime = performance.now();
      const resultados = Array.from({ length: 100 }, (_, i) => {
        const categoriaInput: CategoriaInput = {
          nombre: `Categoría ${i}`,
          usuario_id: 1
        };
        return createCategory(categoriaInput, mockUser);
      });
      const endTime = performance.now();

      // Assert
      expect(resultados.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // Menos de 500ms para 100 categorías
      
      // Verificar que todas las categorías se crearon
      const categoriasFinales = getUserCategories(mockUser);
      expect(categoriasFinales.count).toBe(101); // 1 inicial + 100 nuevas
    });

    test('debe contar errores de validación correctamente', () => {
      // Arrange
      const categoriasInvalidas = [
        { nombre: '', usuario_id: 1 },
        { nombre: 'Alimentación', usuario_id: 1 }, // Duplicado
        { nombre: 'A'.repeat(51), usuario_id: 1 }   // Muy largo
      ];

      // Act
      let errores = 0;
      categoriasInvalidas.forEach(categoria => {
        const result = createCategory(categoria, mockUser);
        if (!result.success) errores++;
      });

      // Assert
      expect(errores).toBe(3); // Todos deben fallar
    });
  });

  describe('Integridad de datos', () => {
    test('debe asignar ID único a cada categoría', () => {
      // Arrange
      const categorias = [
        { nombre: 'Cat1', usuario_id: 1 },
        { nombre: 'Cat2', usuario_id: 1 },
        { nombre: 'Cat3', usuario_id: 1 }
      ];

      // Act
      const resultados = categorias.map(cat => createCategory(cat, mockUser));

      // Assert
      expect(resultados.every(r => r.success)).toBe(true);
      const ids = resultados.map(r => r.category?.id);
      const idsUnicos = new Set(ids);
      expect(idsUnicos.size).toBe(3); // Todos los IDs deben ser únicos
    });

    test('debe establecer fecha de creación', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Test Fecha',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category?.fecha_creacion).toBeDefined();
      expect(new Date(result.category!.fecha_creacion)).toBeInstanceOf(Date);
    });

    test('debe marcar categoría como activa por defecto', () => {
      // Arrange
      const categoriaInput: CategoriaInput = {
        nombre: 'Categoría Activa',
        usuario_id: 1
      };

      // Act
      const result = createCategory(categoriaInput, mockUser);

      // Assert
      expect(result.success).toBe(true);
      expect(result.category?.activa).toBe(true);
    });
  });
});