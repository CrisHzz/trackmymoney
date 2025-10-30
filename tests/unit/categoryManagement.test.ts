import { categorias, usuarios } from '../__fixtures__/testData';
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
let mockCategories: Categoria[] = [];
let nextCategoryId = 1;
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
const clearMockCategories = () => {
  mockCategories = [];
  nextCategoryId = 1;
};
const addMockCategory = (categoria: Omit<Categoria, 'id'>) => {
  const nuevaCategoria = { ...categoria, id: nextCategoryId++ };
  mockCategories.push(nuevaCategoria);
  return nuevaCategoria;
};
describe('Gestión de Categorías - Lógica de Negocio', () => {
  let mockUser: Usuario;
  beforeEach(() => {
    clearMockCategories();
    mockUser = {
      id: 1,
      email: 'test@example.com',
      clerk_id: 'clerk_123',
      activo: true
    };
  });
  describe('getUserCategories - Obtener categorías del usuario', () => {
    it('debe listar categorías del usuario autenticado', () => {
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
      const result = getUserCategories(mockUser);
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(2);
      expect(result.count).toBe(2);
      result.categories.forEach(cat => {
        expect(cat.usuario_id).toBe(1);
        expect(cat.activa).toBe(true);
      });
    });
    it('debe rechazar usuario no autenticado', () => {
      const usuarioNoAuth = null as any;
      const result = getUserCategories(usuarioNoAuth);
      expect(result.success).toBe(false);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('Usuario no autenticado');
      expect(result.count).toBe(0);
    });
    it('debe ordenar categorías alfabéticamente', () => {
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
      const result = getUserCategories(mockUser);
      expect(result.success).toBe(true);
      expect(result.categories[0].nombre).toBe('Alimentación');
      expect(result.categories[1].nombre).toBe('Transporte');
    });
    it('debe manejar usuario sin categorías', () => {
      const result = getUserCategories(mockUser);
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(0);
      expect(result.message).toBe('No hay categorías registradas');
      expect(result.count).toBe(0);
    });
    it('debe rechazar usuario inactivo', () => {
      const usuarioInactivo = { ...mockUser, activo: false };
      addMockCategory({
        nombre: 'Test',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-15T10:00:00Z'
      });
      const result = getUserCategories(usuarioInactivo);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario inactivo');
    });
    it('debe filtrar solo categorías activas', () => {
      addMockCategory({
        nombre: 'Activa',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-15T10:00:00Z'
      });
      addMockCategory({
        nombre: 'Inactiva',
        usuario_id: 1,
        activa: false,
        fecha_creacion: '2024-01-16T10:00:00Z'
      });
      const result = getUserCategories(mockUser);
      expect(result.success).toBe(true);
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].nombre).toBe('Activa');
    });
  });
  describe('createCategory - Crear nueva categoría', () => {
    it('debe crear categoría con nombre válido', () => {
      const categoriaInput: CategoriaInput = {
        nombre: 'Nueva Categoría',
        usuario_id: 1
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(true);
      expect(result.category).toBeDefined();
      expect(result.category?.nombre).toBe('Nueva Categoría');
      expect(result.category?.usuario_id).toBe(1);
      expect(result.message).toBe('Categoría creada exitosamente');
    });
    it('debe rechazar nombre vacío', () => {
      const categoriaInput: CategoriaInput = {
        nombre: '',
        usuario_id: 1
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(false);
      expect(result.message).toBe('El nombre de la categoría es obligatorio');
    });
    it('debe rechazar nombre duplicado', () => {
      addMockCategory({
        nombre: 'Alimentación',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-15T10:00:00Z'
      });
      const categoriaInput: CategoriaInput = {
        nombre: 'Alimentación',
        usuario_id: 1
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Ya existe una categoría con este nombre');
    });
    it('debe validar longitud máxima del nombre', () => {
      const nombreMuyLargo = 'A'.repeat(51);
      const categoriaInput: CategoriaInput = {
        nombre: nombreMuyLargo,
        usuario_id: 1
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(false);
      expect(result.message).toBe('El nombre de la categoría no puede exceder 50 caracteres');
    });
    it('debe rechazar usuario no autorizado', () => {
      const categoriaInput: CategoriaInput = {
        nombre: 'Nueva Categoría',
        usuario_id: 999
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario no autorizado para crear esta categoría');
    });
    it('debe limpiar espacios en blanco del nombre', () => {
      const categoriaInput: CategoriaInput = {
        nombre: '  Nueva Categoría Con Espacios  ',
        usuario_id: 1
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(true);
      expect(result.category?.nombre).toBe('Nueva Categoría Con Espacios');
      expect(result.category?.nombre).not.toMatch(/^\s/);
      expect(result.category?.nombre).not.toMatch(/\s$/);
    });
    it('debe detectar duplicados insensible a mayúsculas', () => {
      addMockCategory({
        nombre: 'Alimentación',
        usuario_id: 1,
        activa: true,
        fecha_creacion: '2024-01-15T10:00:00Z'
      });
      const categoriaInput: CategoriaInput = {
        nombre: 'ALIMENTACIÓN',
        usuario_id: 1
      };
      const result = createCategory(categoriaInput, mockUser);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Ya existe una categoría');
    });
  });
});
