# 🚀 Configuración de Pruebas E2E - TrackMyMoney

## 📋 Problema Identificado

Las pruebas E2E estaban fallando porque la aplicación usa **Clerk** para autenticación, y todas las páginas están protegidas. Las pruebas intentaban acceder directamente a `/pages/expenses` y `/pages/income` sin hacer login primero.

## ✅ Solución Implementada

Se ha implementado un sistema de login automático en las pruebas usando el patrón Screenplay.

### Archivos Modificados:

1. **`screenplay/tasks/Login.ts`** - Nueva tarea para manejar autenticación
2. **`tests/expenses.spec.ts`** - Actualizado para incluir login antes de cada prueba
3. **`tests/income.spec.ts`** - Actualizado para incluir login antes de cada prueba
4. **`playwright.config.ts`** - Configurado para cargar variables de entorno

## 🔧 Pasos para Configurar

### 1. Crear Usuario de Prueba en Clerk

Primero necesitas crear un usuario de prueba en tu dashboard de Clerk:

1. Ve a tu [Dashboard de Clerk](https://dashboard.clerk.com/)
2. Selecciona tu aplicación TrackMyMoney
3. Ve a "Users" → "Create User"
4. Crea un usuario con estas credenciales:
   - **Email**: `test@trackmymoney.com`
   - **Password**: `TestPassword123!`

### 2. Configurar Variables de Entorno

```bash
# En el directorio testEntrega3/
cp env.test.example .env.test
```

Edita el archivo `.env.test` con las credenciales correctas:

```env
TEST_USER_EMAIL=test@trackmymoney.com
TEST_USER_PASSWORD=TestPassword123!
BASE_URL=http://localhost:3000
```

### 3. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install dotenv --save-dev
```

### 4. Ejecutar las Pruebas

```bash
# Asegúrate de que la aplicación esté corriendo
npm run dev

# En otra terminal, ejecuta las pruebas
npm run test:e2e

# Para ejecutar con UI
npm run test:e2e:ui

# Para debug
npm run test:e2e:debug
```

## 🎯 Alternativas de Configuración

### Opción A: Usuario Real (Recomendado)
Usar las credenciales de un usuario real que ya tengas en la aplicación.

### Opción B: Mock de Autenticación
Si prefieres no usar credenciales reales, puedes:

1. Crear un endpoint de bypass para pruebas
2. Usar Playwright para interceptar requests de autenticación
3. Configurar un entorno de pruebas separado

### Opción C: Variables de Entorno del Sistema

```bash
# Windows
set TEST_USER_EMAIL=tu-email@ejemplo.com
set TEST_USER_PASSWORD=tu-password

# Linux/Mac
export TEST_USER_EMAIL=tu-email@ejemplo.com
export TEST_USER_PASSWORD=tu-password
```

## 🔍 Verificación

Para verificar que todo funciona:

```bash
# Ejecutar una sola prueba
npx playwright test --config=testEntrega3/playwright.config.ts --grep "debe crear un gasto básico"

# Ver el reporte
npm run test:e2e:report
```

## 🚨 Solución de Problemas

### Error: "Login falló"
- Verifica que las credenciales en `.env.test` sean correctas
- Asegúrate de que el usuario existe en Clerk
- Verifica que la aplicación esté corriendo en `http://localhost:3000`

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv --save-dev
```

### Pruebas lentas
- Ajusta `PLAYWRIGHT_SLOW_MO` en `.env.test`
- Usa `--workers=1` para ejecutar pruebas secuencialmente

### Clerk no carga
- Verifica que las variables de entorno de Clerk estén configuradas
- Asegúrate de que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` esté definida

## 📊 Resultados Esperados

Después de la configuración, deberías ver:
- ✅ Todas las pruebas de gastos pasando
- ✅ Todas las pruebas de ingresos pasando  
- ✅ Login automático funcionando
- ✅ Navegación a páginas protegidas exitosa

## 🔄 Próximos Pasos

1. Ejecutar las pruebas y verificar que pasen
2. Ajustar timeouts si es necesario
3. Agregar más casos de prueba si se requiere
4. Configurar CI/CD con estas credenciales
