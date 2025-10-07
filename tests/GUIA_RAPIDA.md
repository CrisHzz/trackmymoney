# 🚀 Guía Rápida de Pruebas

Esta es una guía rápida de referencia para trabajar con las pruebas del proyecto.

## ⚡ Comandos Esenciales

```bash
# Ejecutar todas las pruebas
npm run test:jest

# Modo watch (desarrollo)
npm run test:watch

# Cobertura
npm run test:coverage

# Solo unitarias
npm run test:jest -- tests/unit

# Solo integración
npm run test:jest -- tests/integration

# Un archivo específico
npm run test:jest -- tests/unit/mathUtils.test.ts
```

## 📝 Plantilla de Test Unitario

```typescript
/**
 * Principios FIRST: Fast, Independent, Repeatable, Self-validating, Timely
 * Patrón AAA: Arrange-Act-Assert
 */

import { miFuncion } from '@/lib/miModulo';

describe('miModulo - Descripción', () => {
  describe('miFuncion', () => {
    it('debe hacer algo específico', () => {
      // Arrange
      const input = 'valor';
      const expected = 'resultado';

      // Act
      const result = miFuncion(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## 🔌 Plantilla de Test de Integración

```typescript
import { GET, POST } from '@/app/api/miendpoint/route';

// Mocks
jest.mock('@clerk/nextjs/server');
jest.mock('@prisma/client');

import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

describe('API MiEndpoint', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
  });

  it('debe retornar datos correctos', async () => {
    // Arrange
    (currentUser as jest.Mock).mockResolvedValue(mockUser);
    mockPrisma.modelo.findMany.mockResolvedValue([data]);

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
  });
});
```

## 🎯 Assertions Más Comunes

```typescript
// Igualdad
expect(value).toBe(expected);
expect(obj).toEqual(expectedObj);

// Booleanos
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Números
expect(num).toBeGreaterThan(5);
expect(num).toBeLessThan(10);
expect(num).toBeCloseTo(3.14, 2);

// Strings
expect(str).toContain('substring');
expect(str).toMatch(/regex/);

// Arrays
expect(arr).toHaveLength(3);
expect(arr).toContain(element);

// Excepciones
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('Error message');

// Llamadas a funciones
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(2);
```

## 🎭 Uso de Mocks

### Mock de Función Simple
```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('valor');
mockFn.mockResolvedValue('async valor');
```

### Mock de Clerk (Auth)
```typescript
import { currentUser } from '@clerk/nextjs/server';

const mockUser = {
  id: 'clerk_123',
  emailAddresses: [{ emailAddress: 'test@example.com' }]
};

(currentUser as jest.Mock).mockResolvedValue(mockUser);
// O para no autenticado
(currentUser as jest.Mock).mockResolvedValue(null);
```

### Mock de Prisma
```typescript
import { PrismaClient } from '@prisma/client';

const mockPrisma = new PrismaClient();
mockPrisma.usuario.findFirst.mockResolvedValue(userData);
mockPrisma.gasto.create.mockResolvedValue(createdGasto);
```

## 📦 Uso de Fixtures

```typescript
import { usuarios, gastos, categorias } from '../__fixtures__/testData';

// Usar datos predefinidos
mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);

// Crear datos personalizados
import { crearGasto } from '../__fixtures__/testData';
const customGasto = crearGasto({ monto: 500 });
```

## 🐛 Debugging

```bash
# Solo ejecutar un test
it.only('este test', () => {});

# Saltar un test
it.skip('este test', () => {});

# Ver output detallado
npm run test:jest -- --verbose

# Debug con node inspector
node --inspect-brk node_modules/.bin/jest tests/unit/mytest.test.ts
```

## ✅ Checklist Pre-Commit

- [ ] Todos los tests pasan: `npm run test:jest`
- [ ] Cobertura >= 70%: `npm run test:coverage`
- [ ] Tests siguen patrón AAA
- [ ] Tests siguen principios FIRST
- [ ] Usa fluent assertions
- [ ] Documentados con comentarios
- [ ] Usa mocks/fixtures centralizados

## 🚫 Qué NO Hacer

❌ NO crear datos inline repetidamente - Usa fixtures  
❌ NO hacer tests dependientes entre sí - Cada test independiente  
❌ NO usar BD real - Siempre usa mocks  
❌ NO hacer tests lentos - Mantén < 1s por test  
❌ NO probar PWA/Service Workers/Offline - Fuera del alcance  

## 📊 Estructura de Archivos

```
tests/
├── unit/              # Lógica pura, sin I/O
├── integration/       # APIs, flujos completos
├── __mocks__/         # Mocks centralizados
└── __fixtures__/      # Datos de prueba
```

## 🎓 Mejores Prácticas

1. **Un concepto por test**: Cada test verifica una cosa
2. **Nombres descriptivos**: `debe sumar dos números positivos`
3. **Arrange-Act-Assert**: Siempre en ese orden
4. **Independent**: Setup en beforeEach
5. **Fast**: Mocks en lugar de I/O real
6. **Fluent Assertions**: expect(x).toBe(y) en lugar de expect(x == y).toBe(true)

## 📚 Más Información

Ver documentación completa en `tests/README.md`

