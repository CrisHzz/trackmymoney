# 🚀 Guía de Inicio Rápido - Pruebas E2E

Esta guía te ayudará a ejecutar las pruebas E2E en menos de 5 minutos.

## ⚡ Inicio Rápido (3 pasos)

### 1. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install

# Instalar navegadores de Playwright
npx playwright install
```

### 2. Iniciar la Aplicación

```bash
# En una terminal separada
npm run dev
```

La aplicación debe estar corriendo en `http://localhost:3000`

### 3. Ejecutar las Pruebas

```bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# O con interfaz visual
npm run test:e2e:ui
```

## 📊 Ver Resultados

Después de ejecutar las pruebas:

```bash
npm run test:e2e:report
```

Esto abrirá un reporte HTML interactivo con:
- ✅ Pruebas pasadas y fallidas
- 📸 Screenshots de fallos
- 🎥 Videos de ejecución
- 📝 Detalles de cada paso

## 🎯 Ejecutar Pruebas Específicas

```bash
# Solo pruebas de gastos
npx playwright test tests/expenses.spec.ts --config=testEntrega3/playwright.config.ts

# Solo pruebas de ingresos
npx playwright test tests/income.spec.ts --config=testEntrega3/playwright.config.ts

# Una prueba específica
npx playwright test -g "debe crear un gasto básico" --config=testEntrega3/playwright.config.ts
```

## 🐛 Modo Debug

```bash
# Ejecutar con inspector visual
npm run test:e2e:debug
```

Esto te permite:
- Pausar la ejecución en cada paso
- Inspeccionar elementos en tiempo real
- Ver el estado de la aplicación
- Ejecutar comandos manualmente

## 📖 Siguiente Paso

Lee el [README completo](./README.md) para:
- Entender el Patrón Screenplay
- Aprender a escribir nuevas pruebas
- Ver todos los componentes disponibles
- Consultar mejores prácticas

## ❓ Problemas Comunes

### La aplicación no inicia
```bash
# Verificar que no haya otro proceso en el puerto 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

### Navegadores no se instalan
```bash
# Instalar manualmente
npx playwright install chromium firefox webkit
```

### Las pruebas no encuentran elementos
```bash
# Ejecutar con navegador visible para ver qué pasa
npm run test:e2e:headed
```

## 📞 Soporte

- Lee la documentación completa: `testEntrega3/README.md`
- Revisa el troubleshooting: Sección en README
- Consulta la documentación de Playwright: https://playwright.dev/

---

**¡Listo para empezar! 🎉**

