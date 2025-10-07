# 🧪 Arquitectura de Pruebas - TrackMyMoney

Documentación completa de la arquitectura de pruebas unitarias e integración del proyecto.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Principios Aplicados](#principios-aplicados)
- [Convenciones y Patrones](#convenciones-y-patrones)
- [Ejecución de Pruebas](#ejecución-de-pruebas)
- [Escribir Nuevas Pruebas](#escribir-nuevas-pruebas)
- [Mocks y Test Doubles](#mocks-y-test-doubles)

---

## 🗂️ Estructura del Proyecto

```
tests/
├── unit/                          # Pruebas unitarias
│   ├── mathUtils.test.ts         # Utils matemáticas
│   ├── arrayUtils.test.ts        # Utils de arrays
│   ├── dateUtils.test.ts         # Utils de fechas
│   ├── stringUtils.test.ts       # Utils de strings
│   └── categoryManagement.test.ts # Lógica de negocio
│
├── integration/                   # Pruebas de integración
│   ├── gastos.api.test.ts        # API de gastos
│   ├── ingresos.api.test.ts      # API de ingresos
│   └── categorias.api.test.ts    # API de categorías
│
├── __mocks__/                     # Mocks centralizados
│   ├── prisma.ts                 # Mock de Prisma Client
│   └── clerk.ts                  # Mock de Clerk Auth
│
├── __fixtures__/                  # Datos de prueba
│   └── testData.ts               # Fixtures reutilizables
│
└── README.md                      # Esta documentación
```

---

## 🎯 Principios Aplicados

### 1. **Principios FIRST**

Todas las pruebas siguen los principios FIRST para garantizar calidad:

- **F**ast (Rápidas): Sin I/O real, usando mocks
- **I**ndependent (Independientes): Sin dependencias entre tests
- **R**epeatable (Repetibles): Resultados consistentes siempre
- **S**elf-validating (Auto-validantes): Pass/Fail automático
- **T**imely (Oportunas): Escritas junto al código

### 2. **Patrón AAA (Arrange-Act-Assert)**

Cada test sigue la estructura AAA:

```typescript
it('debe sumar dos números correctamente', () => {
  // Arrange (Preparar)
  const num1 = 2;
  const num2 = 3;
  const expectedResult = 5;

  // Act (Actuar)
  const result = add(num1, num2);

  // Assert (Verificar)
  expect(result).toBe(expectedResult);
});
```

### 3. **Test Doubles**

Implementamos diferentes tipos de test doubles:

- **Mocks**: Para verificar interacciones (Prisma, Clerk)
- **Stubs**: Para retornar datos fijos
- **Fakes**: Para simular BD en memoria
- **Spies**: Para monitorear llamadas a funciones

---

## 🔧 Convenciones y Patrones

### Nomenclatura de Tests

```typescript
describe('NombreDelModulo - Descripción', () => {
  describe('nombreFuncion - Descripción de funcionalidad', () => {
    it('debe hacer algo específico en un escenario concreto', () => {
      // Test code
    });
  });
});
```

### Fluent Assertions

Usamos matchers expresivos para mejorar legibilidad:

```typescript
// ✅ Bueno - Assertions expresivas
expect(result).toBe(expectedValue);
expect(result).toBeGreaterThan(0);
expect(result).toHaveLength(3);
expect(array).toContain(element);
expect(result).toBeDefined();
expect(result).toBeTruthy();

// ❌ Evitar - Assertions poco claras
expect(result == expectedValue).toBe(true);
expect(result > 0).toBe(true);
```

### Setup y Teardown

```typescript
describe('MiModulo', () => {
  beforeEach(() => {
    // Arrange: Setup antes de cada test (FIRST: Independent)
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup después de cada test
    // Limpiar estado si es necesario
  });
});
```

---

## 🚀 Ejecución de Pruebas

### Comandos Disponibles

```bash
# Ejecutar todas las pruebas
npm run test:jest

# Ejecutar en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar solo pruebas unitarias
npm run test:jest -- tests/unit

# Ejecutar solo pruebas de integración
npm run test:jest -- tests/integration

# Ejecutar un archivo específico
npm run test:jest -- tests/unit/mathUtils.test.ts
```

### Cobertura de Código

El proyecto mantiene los siguientes umbrales de cobertura:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Ver reporte completo:
```bash
npm run test:coverage
# Luego abrir: coverage/lcov-report/index.html
```

---

## ✍️ Escribir Nuevas Pruebas

### Pruebas Unitarias

```typescript
/**
 * tests/unit/miModulo.test.ts
 * 
 * Principios FIRST aplicados:
 * - Fast: Sin I/O
 * - Independent: Sin estado compartido
 * - Repeatable: Fixtures consistentes
 * - Self-validating: Assertions automáticas
 * - Timely: Tests con el código
 * 
 * Patrón AAA aplicado
 */

import { miFuncion } from '@/lib/miModulo';

describe('miModulo - Descripción', () => {
  describe('miFuncion - Funcionalidad específica', () => {
    it('debe comportarse correctamente en caso normal', () => {
      // Arrange
      const input = 'valor';
      const expected = 'resultado';

      // Act
      const result = miFuncion(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('debe manejar casos límite', () => {
      // Arrange
      const edgeCase = '';

      // Act & Assert
      expect(() => miFuncion(edgeCase)).toThrow();
    });
  });
});
```

### Pruebas de Integración

```typescript
/**
 * tests/integration/miApi.test.ts
 * 
 * Principios FIRST aplicados
 * Test Doubles: Mocks de dependencias externas
 */

import { GET, POST } from '@/app/api/miendpoint/route';

// Importar y configurar mocks
jest.mock('@clerk/nextjs/server');
jest.mock('@prisma/client');

import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

describe('API MiEndpoint - Pruebas de Integración', () => {
  let mockPrisma: any;

  beforeEach(() => {
    // Arrange: Setup de mocks
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
  });

  describe('GET /api/miendpoint', () => {
    it('debe retornar datos para usuario autenticado', async () => {
      // Arrange
      const mockUser = { id: 'user_123', emailAddresses: [/*...*/] };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      mockPrisma.miModelo.findMany.mockResolvedValue([/*datos*/]);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(mockPrisma.miModelo.findMany).toHaveBeenCalled();
    });
  });
});
```

---

## 🎭 Mocks y Test Doubles

### Uso de Mocks Centralizados

Los mocks están en `tests/__mocks__/`:

```typescript
// En tu test
import { mockAuthenticatedUser, resetClerkMock } from '../__mocks__/clerk';
import { mockPrismaClient } from '../__mocks__/prisma';

beforeEach(() => {
  mockAuthenticatedUser(); // Helper para setup rápido
});
```

### Fixtures de Datos

Usa fixtures en lugar de crear datos inline:

```typescript
import { usuarios, gastos, categorias } from '../__fixtures__/testData';

// ✅ Bueno - Usa fixtures
mockPrisma.usuario.findFirst.mockResolvedValue(usuarios.usuario1);

// ❌ Evitar - Datos inline repetidos
mockPrisma.usuario.findFirst.mockResolvedValue({
  id: 1,
  nombre: 'Test',
  email: 'test@example.com',
  // ...más campos
});
```

### Helpers para Crear Datos

```typescript
import { crearGasto, crearCategoria } from '../__fixtures__/testData';

// Crear datos con overrides
const gastoCustom = crearGasto({
  monto: 500,
  descripcion: 'Personalizado'
});
```

---

## 📊 Qué NO se Prueba

Siguiendo los requisitos del proyecto, **NO** se incluyen pruebas de:

- ❌ PWA (Progressive Web Apps)
- ❌ Service Workers
- ❌ Funcionalidad Offline (Dexie, offlineStorage)
- ❌ Observabilidad (Grafana, Kibana)
- ❌ Telemetría
- ❌ Métricas de performance
- ❌ Pruebas E2E (están en `testEntrega3/`)

---

## 🔍 Debugging de Tests

### Ver output detallado

```bash
npm run test:jest -- --verbose
```

### Ejecutar un solo test

```typescript
it.only('debe ejecutar solo este test', () => {
  // Solo este test se ejecutará
});
```

### Saltar un test temporalmente

```typescript
it.skip('este test se saltará', () => {
  // No se ejecutará
});
```

### Debug con breakpoints

```bash
node --inspect-brk node_modules/.bin/jest tests/unit/mathUtils.test.ts
```

---

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Test Doubles Patterns](https://martinfowler.com/bliki/TestDouble.html)
- [FIRST Principles](https://github.com/ghsukumar/SFDC_Best_Practices/wiki/F.I.R.S.T-Principles-of-Unit-Testing)

---

## 🤝 Contribuir

Al agregar nuevas pruebas:

1. ✅ Seguir patrón AAA
2. ✅ Aplicar principios FIRST
3. ✅ Usar fluent assertions
4. ✅ Documentar con comentarios
5. ✅ Agregar a cobertura mínima 70%
6. ✅ Usar mocks centralizados
7. ✅ Verificar que pasan: `npm run test:jest`

---

## 📞 Soporte

Para dudas sobre las pruebas, consulta:
- Esta documentación
- Ejemplos en `tests/unit/` y `tests/integration/`
- Código con comentarios explicativos

---

**Última actualización**: Octubre 2025

