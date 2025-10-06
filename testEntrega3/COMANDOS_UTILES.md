# 🎮 Comandos Útiles - Pruebas E2E

## 📦 Instalación

```bash
# Instalar todas las dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install

# Instalar un navegador específico
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## 🚀 Ejecución de Pruebas

### Comandos Básicos

```bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# Ejecutar con interfaz visual (recomendado para desarrollo)
npm run test:e2e:ui

# Ejecutar con navegador visible
npm run test:e2e:headed

# Ejecutar en modo debug
npm run test:e2e:debug

# Ver reporte de resultados
npm run test:e2e:report
```

### Comandos Avanzados

```bash
# Ejecutar solo un archivo específico
npx playwright test tests/expenses.spec.ts --config=testEntrega3/playwright.config.ts

# Ejecutar solo una prueba específica por nombre
npx playwright test -g "debe crear un gasto básico" --config=testEntrega3/playwright.config.ts

# Ejecutar en un navegador específico
npx playwright test --project=chromium --config=testEntrega3/playwright.config.ts
npx playwright test --project=firefox --config=testEntrega3/playwright.config.ts
npx playwright test --project=webkit --config=testEntrega3/playwright.config.ts

# Ejecutar con más paralelismo (4 workers)
npx playwright test --workers=4 --config=testEntrega3/playwright.config.ts

# Ejecutar sin paralelismo (útil para debugging)
npx playwright test --workers=1 --config=testEntrega3/playwright.config.ts

# Ejecutar con trace habilitado
npx playwright test --trace=on --config=testEntrega3/playwright.config.ts

# Ejecutar y actualizar screenshots (si tienes visual testing)
npx playwright test --update-snapshots --config=testEntrega3/playwright.config.ts
```

## 🐛 Debugging

```bash
# Abrir Playwright Inspector
npx playwright test --debug --config=testEntrega3/playwright.config.ts

# Ver trace de una prueba fallida
npx playwright show-trace testEntrega3/test-results/[nombre-del-test]/trace.zip

# Generar código de prueba grabando acciones
npx playwright codegen http://localhost:3000

# Abrir Playwright UI mode (modo interactivo)
npm run test:e2e:ui
```

## 📊 Reportes

```bash
# Ver reporte HTML
npm run test:e2e:report

# O manualmente
npx playwright show-report testEntrega3/playwright-report

# Ver resultados en JSON
cat testEntrega3/test-results.json

# Generar reporte en diferentes formatos
npx playwright test --reporter=html --config=testEntrega3/playwright.config.ts
npx playwright test --reporter=json --config=testEntrega3/playwright.config.ts
npx playwright test --reporter=list --config=testEntrega3/playwright.config.ts
```

## 🧹 Limpieza

```bash
# Limpiar resultados de pruebas
rm -rf testEntrega3/test-results
rm -rf testEntrega3/playwright-report

# Limpiar todo (incluye screenshots, videos, traces)
rm -rf testEntrega3/test-results testEntrega3/playwright-report testEntrega3/screenshots testEntrega3/videos testEntrega3/traces
```

## 🔧 Configuración

```bash
# Verificar instalación de Playwright
npx playwright --version

# Listar navegadores instalados
npx playwright list-devices

# Mostrar información del sistema
npx playwright doctor

# Actualizar Playwright
npm install -D @playwright/test@latest
npx playwright install
```

## 🌐 Servidor de Desarrollo

```bash
# Iniciar aplicación (en terminal separada)
npm run dev

# Verificar que la app está corriendo
curl http://localhost:3000

# Ver logs del servidor
npm run dev | tee server.log
```

## 📝 Desarrollo de Pruebas

```bash
# Ejecutar pruebas en modo watch (se re-ejecutan al guardar)
npx playwright test --ui --config=testEntrega3/playwright.config.ts

# Ejecutar con verbose para más información
npx playwright test --verbose --config=testEntrega3/playwright.config.ts

# Ejecutar solo pruebas fallidas
npx playwright test --last-failed --config=testEntrega3/playwright.config.ts

# Ejecutar con timeout personalizado
npx playwright test --timeout=60000 --config=testEntrega3/playwright.config.ts
```

## 🎯 Comandos por Funcionalidad

### Solo Gastos

```bash
# Todas las pruebas de gastos
npx playwright test tests/expenses.spec.ts --config=testEntrega3/playwright.config.ts

# Suite principal de gastos
npx playwright test tests/expenses.spec.ts -g "Gestión de Gastos - TrackMyMoney" --config=testEntrega3/playwright.config.ts

# Suite de casos extremos
npx playwright test tests/expenses.spec.ts -g "Casos Extremos" --config=testEntrega3/playwright.config.ts
```

### Solo Ingresos

```bash
# Todas las pruebas de ingresos
npx playwright test tests/income.spec.ts --config=testEntrega3/playwright.config.ts

# Suite principal de ingresos
npx playwright test tests/income.spec.ts -g "Gestión de Ingresos - TrackMyMoney" --config=testEntrega3/playwright.config.ts
```

## 🚨 Troubleshooting

```bash
# Verificar puertos ocupados
# Linux/Mac
lsof -ti:3000

# Windows
netstat -ano | findstr :3000

# Matar proceso en puerto 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
FOR /F "tokens=5" %a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %a

# Reinstalar Playwright completamente
npm uninstall @playwright/test
npm install -D @playwright/test
npx playwright install --with-deps

# Verificar configuración
cat testEntrega3/playwright.config.ts

# Ver variables de entorno
printenv | grep BASE_URL  # Linux/Mac
set | findstr BASE_URL    # Windows
```

## 📸 Screenshots y Videos

```bash
# Tomar screenshot de página específica
npx playwright screenshot http://localhost:3000/pages/expenses

# Ver videos de pruebas fallidas
ls testEntrega3/test-results/*/video.webm

# Abrir video con VLC (ejemplo)
vlc testEntrega3/test-results/expenses-spec-ts-crear-gasto/video.webm
```

## 🔍 Inspeccionar Elementos

```bash
# Abrir inspector con la página
npx playwright inspector http://localhost:3000

# Abrir inspector con código de prueba
npx playwright test --debug -g "crear gasto" --config=testEntrega3/playwright.config.ts
```

## 📦 CI/CD (Ejemplos)

```bash
# Comando para CI (sin navegador visual)
CI=1 npx playwright test --config=testEntrega3/playwright.config.ts

# Con reintentos en CI
CI=1 npx playwright test --retries=2 --config=testEntrega3/playwright.config.ts

# Generar reporte para CI
CI=1 npx playwright test --reporter=json --config=testEntrega3/playwright.config.ts > results.json
```

## 🎓 Ayuda

```bash
# Ver ayuda general de Playwright
npx playwright --help

# Ver ayuda de comando test
npx playwright test --help

# Ver ayuda de configuración
npx playwright config --help

# Abrir documentación oficial
npx playwright show-doc
```

## ⚡ Atajos Útiles

```bash
# Alias útiles (agregar a .bashrc o .zshrc)
alias pw='npx playwright test --config=testEntrega3/playwright.config.ts'
alias pwui='npm run test:e2e:ui'
alias pwdebug='npm run test:e2e:debug'
alias pwreport='npm run test:e2e:report'

# Uso después de agregar alias
pw                    # Ejecutar pruebas
pwui                  # Modo UI
pw -g "crear gasto"   # Prueba específica
```

## 📱 Pruebas Móviles (Opcional)

```bash
# Ejecutar en emulación móvil
npx playwright test --project="Mobile Chrome" --config=testEntrega3/playwright.config.ts
npx playwright test --project="Mobile Safari" --config=testEntrega3/playwright.config.ts

# Ver dispositivos disponibles
npx playwright list-devices
```

## 🌍 Diferentes Entornos

```bash
# Desarrollo
BASE_URL=http://localhost:3000 npm run test:e2e

# Staging
BASE_URL=https://staging.trackmymoney.com npm run test:e2e

# Producción (¡cuidado!)
BASE_URL=https://trackmymoney.com npm run test:e2e
```

## 📊 Estadísticas

```bash
# Contar número de pruebas
npx playwright test --list --config=testEntrega3/playwright.config.ts

# Ver tiempo de ejecución
time npm run test:e2e

# Generar reporte de cobertura (si está configurado)
npm run test:e2e -- --coverage
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para Desarrollo

```bash
# 1. Iniciar aplicación
npm run dev

# 2. Abrir UI mode en otra terminal
npm run test:e2e:ui

# 3. Seleccionar y ejecutar pruebas visualmente
# 4. Ver resultados en tiempo real
```

### Para CI/CD

```bash
# 1. Build
npm run build

# 2. Start
npm start &

# 3. Ejecutar pruebas
CI=1 npm run test:e2e

# 4. Generar reporte
npm run test:e2e:report
```

### Para Debugging

```bash
# 1. Ejecutar con debug
npm run test:e2e:debug -g "nombre de prueba"

# 2. Usar inspector para pausar y revisar
# 3. Hacer cambios en el código
# 4. Re-ejecutar
```

---

**💡 Tip**: Guarda este archivo como referencia rápida. Los comandos más usados son:
- `npm run test:e2e:ui` - Para desarrollo
- `npm run test:e2e` - Para ejecutar todas
- `npm run test:e2e:debug` - Para debugging

