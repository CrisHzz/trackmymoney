# 💰 TrackMyMoney - Gestión Financiera Personal

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.28-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6.8.2-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</div>

## 📖 Descripción

**TrackMyMoney** es una aplicación web moderna y completa para la gestión financiera personal, diseñada específicamente para ayudar a las personas a rastrear y controlar sus gastos e ingresos diarios. La aplicación se enfoca en el "menudeo" y esas pequeñas transacciones que, aunque parezcan insignificantes, pueden tener un impacto significativo en las finanzas personales.Tiene la particularidad de ser PWA es decir poder funcionar con ciertas caracteristicas sin internet.

### 🎯 Características Principales

- **📊 Dashboard Interactivo**: Panel de control con estadísticas en tiempo real
- **💰 Gestión de Gastos**: Registro detallado de gastos con categorización
- **💵 Control de Ingresos**: Seguimiento de ingresos regulares e irregulares
- **📈 Proyecciones Financieras**: Análisis y predicciones de flujo de efectivo
- **📱 Funcionalidad Offline**: Sincronización automática cuando hay conexión
- **🔍 Búsqueda Avanzada**: Motor de búsqueda con Elasticsearch
- **📊 Visualizaciones**: Gráficos interactivos con Recharts
- **🔐 Autenticación Segura**: Sistema de usuarios con Clerk
- **🎨 UI/UX Moderna**: Interfaz elegante con animaciones fluidas

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

#### Frontend
- **Next.js 14.2.28**: Framework React con App Router
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript 5**: Tipado estático para mayor seguridad
- **Tailwind CSS 3.4.1**: Framework CSS utilitario
- **Framer Motion**: Animaciones y transiciones
- **Lucide React**: Iconografía moderna
- **Recharts**: Gráficos y visualizaciones
- **React Hot Toast**: Notificaciones elegantes

#### Backend & Base de Datos
- **Prisma 6.8.2**: ORM moderno para TypeScript
- **PostgreSQL**: Base de datos relacional robusta
- **Elasticsearch 8.12.1**: Motor de búsqueda y análisis
- **Kibana**: Visualización de datos de Elasticsearch

#### Autenticación & Seguridad
- **Clerk**: Autenticación y gestión de usuarios
- **JWT**: Tokens de autenticación seguros

#### Desarrollo & Despliegue
- **Docker**: Containerización completa
- **Docker Compose**: Orquestación de servicios
- **ESLint**: Linting de código
- **PostCSS**: Procesamiento de CSS
- **PWA**: Progressive Web App con Service Worker
- **Dexie**: Base de datos local para funcionalidad offline

### Estructura de la Base de Datos

```sql
-- Modelos principales
Usuario {
  id, nombre, email, sueldo, fecha_registro, moneda_preferida
  relaciones: gastos[], ingresos[], notificaciones[], objetivos[]
}

Categoria {
  id, nombre
  relaciones: gastos[], ingresos[], objetivos[]
}

Gasto {
  id, usuario_id, categoria_id, monto, fecha, descripcion, 
  factura, metodo_pago
}

Ingreso {
  id, usuario_id, categoria_id, monto, fecha, descripcion,
  tipo_ingreso, recurrente, frecuencia, fecha_fin
}

ObjetivoFinanciero {
  id, usuario_id, categoria_id, monto_limite, fecha_inicio, fecha_fin
}

Notificacion {
  id, usuario_id, mensaje, fecha, tipo
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para desarrollo con contenedores)
- [PostgreSQL](https://www.postgresql.org/) (si no usas Docker)

### Opción 1: Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/CrisHzz/trackmymoney.git
   cd trackmymoney
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env.local
   cp .env.example .env.local
   ```
   
   Configurar las siguientes variables:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/trackmymoney"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="tu_clave_publica_clerk"
   CLERK_SECRET_KEY="tu_clave_secreta_clerk"
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma db push
   
   # Poblar datos de ejemplo (opcional)
   npm run db:seed
   ```

5. **Iniciar Elasticsearch** (opcional)
   ```bash
   # Usando Docker
   docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.12.1
   
   # O ejecutar el script de configuración
   node scripts/start-elasticsearch.js
   ```

6. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Opción 2: Usando Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/CrisHzz/trackmymoney.git
   cd trackmymoney
   ```

2. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up -d
   ```

Esto iniciará automáticamente:
- **Aplicación Next.js** en puerto 3000
- **PostgreSQL** en puerto 5432
- **Elasticsearch** en puerto 9200
- **Kibana** en puerto 5601

### Opción 3: Imagen Docker Precompilada

```bash
# Descargar imagen
docker pull davshaw/trackmymoney

# Ejecutar contenedor
docker run -p 3000:3000 davshaw/trackmymoney
```

## 📱 Funcionalidades

### 🏠 Dashboard Principal
- Resumen financiero en tiempo real
- Gráficos de gastos vs ingresos
- Progreso de objetivos financieros
- Notificaciones importantes

### 💸 Gestión de Gastos
- Registro de gastos con categorización
- Adjuntar facturas y comprobantes
- Métodos de pago múltiples
- Búsqueda y filtros avanzados
- Exportación de datos

### 💰 Control de Ingresos
- Registro de ingresos regulares e irregulares
- Configuración de ingresos recurrentes
- Categorización por tipo de ingreso
- Seguimiento de múltiples fuentes

### 📊 Estadísticas y Análisis
- Gráficos interactivos con Recharts
- Análisis de tendencias
- Comparativas mensuales/anuales
- Reportes personalizados

### 🎯 Objetivos Financieros
- Establecimiento de metas de ahorro
- Seguimiento de progreso
- Alertas y notificaciones
- Categorización de objetivos

### 🔍 Búsqueda Avanzada
- Motor de búsqueda con Elasticsearch
- Filtros por fecha, categoría, monto
- Búsqueda semántica
- Historial de búsquedas

### 📱 Funcionalidad Offline & PWA
- **Progressive Web App (PWA)** con instalación nativa
- Almacenamiento local con Dexie
- Sincronización automática cuando hay conexión
- Gestión de transacciones offline
- Indicador de estado de conexión en tiempo real
- **Herramientas de prueba PWA** para desarrollo

### 🔐 Sistema de Usuarios
- Autenticación segura con Clerk
- Perfiles de usuario personalizables
- Preferencias de moneda
- Configuración de notificaciones

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo
npm run dev:db          # Configura base de datos y inicia desarrollo

# Construcción
npm run build           # Construye para producción
npm run start           # Inicia servidor de producción

# Base de datos
npm run db:seed         # Pobla datos de ejemplo
npx prisma studio       # Abre interfaz de Prisma Studio

# Linting
npm run lint            # Ejecuta ESLint

# Docker
docker-compose up -d    # Inicia todos los servicios
docker-compose down     # Detiene todos los servicios
```

## 🧪 Herramientas de Prueba PWA

La aplicación incluye herramientas especiales para probar la funcionalidad PWA y offline:

### 🔧 Controles de Prueba PWA
- **Componente `PWATestControls`**: Panel flotante para desarrollo
- **Simulación de estados offline/online**
- **Creación de datos de prueba**
- **Visualización de datos offline**
- **Sincronización manual**
- **Limpieza de datos de prueba**

### 📱 Características PWA
- **Instalación nativa** en dispositivos móviles y desktop
- **Funcionamiento offline** completo
- **Sincronización automática** cuando hay conexión
- **Indicador de estado** de conexión en tiempo real
- **Almacenamiento local** con Dexie
- **Service Worker** para cache y funcionalidad offline

### 🎯 Cómo Probar la Funcionalidad PWA

1. **En desarrollo** (modo desarrollo):
   - Busca el botón de bug 🐛 en la esquina inferior izquierda
   - Usa los controles para simular estados offline/online
   - Crea datos de prueba para verificar sincronización

2. **En producción**:
   - Usa Chrome DevTools → Network → Throttling → Offline
   - Instala la PWA desde el navegador
   - Prueba la funcionalidad offline

3. **Herramientas de desarrollo**:
   ```bash
   # Ver datos offline en consola
   localStorage.getItem('gastos_offline')
   localStorage.getItem('ingresos_offline')
   
   # Limpiar datos de prueba
   localStorage.clear()
   ```

## 📚 Documentación de la API

La documentación interactiva de la API está disponible en:
- **Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Kibana**: [http://localhost:5601](http://localhost:5601) (para análisis de Elasticsearch)

## 🎨 Características de UI/UX

### Diseño Responsivo
- Adaptable a dispositivos móviles, tablets y desktop
- Navegación intuitiva
- Accesibilidad mejorada

### Animaciones y Transiciones
- Animaciones fluidas con Framer Motion
- Transiciones suaves entre páginas
- Efectos visuales modernos

### Tema y Personalización
- Paleta de colores moderna (púrpura, violeta, esmeralda)
- Modo oscuro/claro
- Personalización de temas

### 📱 Experiencia PWA
- **Instalación nativa** en dispositivos
- **Funcionamiento offline** completo
- **Indicadores de estado** de conexión
- **Sincronización automática** de datos
- **Interfaz adaptativa** para diferentes dispositivos

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/trackmymoney"

# Elasticsearch
ELASTICSEARCH_URL="http://localhost:9200"

# Clerk (Autenticación)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Next.js
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Configuración de Elasticsearch

```javascript
// scripts/start-elasticsearch.js
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

// Crear índices y mappings
await client.indices.create({
  index: 'transactions',
  mappings: {
    properties: {
      amount: { type: 'float' },
      description: { type: 'text' },
      category: { type: 'keyword' },
      type: { type: 'keyword' },
      date: { type: 'date' },
      userId: { type: 'keyword' }
    }
  }
});
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Cristian Hernández**
- GitHub: [@CrisHzz](https://github.com/CrisHzz)
- Proyecto: [TrackMyMoney](https://github.com/CrisHzz/trackmymoney)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Elasticsearch](https://www.elastic.co/) - Motor de búsqueda
- [Clerk](https://clerk.com/) - Autenticación
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Dexie](https://dexie.org/) - Base de datos local para PWA
- [PWA Builder](https://www.pwabuilder.com/) - Herramientas PWA

---

<div align="center">
  <p>⭐ Si este proyecto te ayuda, ¡dale una estrella al repositorio!</p>
  <p>💡 ¿Tienes alguna sugerencia o encontraste un bug? ¡Abre un issue!</p>
</div>
