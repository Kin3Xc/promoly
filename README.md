# 🎯 PromoManager - Sistema de Gestión de Promociones

![Version](https://img.shields.io/badge/Next.js-15.3.5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.11.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Bun](https://img.shields.io/badge/Bun-1.0.37-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue)

Dashboard completo para gestionar promociones de tiendas VTEX y Shopify con migración a PostgreSQL para mayor escalabilidad.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Guía de Instalación Rápida](#-guía-de-instalación-rápida)
- [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)
- [Administración con pgAdmin](#-administración-con-pgadmin)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecutar el Proyecto](#-ejecutar-el-proyecto)
- [Comandos Disponibles](#-comandos-disponibles)
- [Solución de Problemas](#-solución-de-problemas)
- [Características](#-características)

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js / Bun Runtime**: Bun 1.0+ (recomendado) o Node.js 18+
- **Docker**: Docker 20.10+ y Docker Compose
- **Git**: Para clonar el repositorio
- **Editor de código**: VS Code (recomendado) o tu editor favorito

### Verificar instalación

```bash
# Verificar Bun
bun --version

# Verificar Docker
docker --version
docker-compose --version

# Verificar Git
git --version
```

## 🚀 Guía de Instalación Rápida

### Paso 1: Clonar el repositorio

```bash
# Clonar el repositorio
git clone <tu-repositorio-url>
cd my-project

# O navegar al directorio del proyecto si ya lo tienes clonado
cd /home/z/my-project
```

### Paso 2: Instalar dependencias

```bash
# Instalar todas las dependencias del proyecto
bun install
```

### Paso 3: Configurar la base de datos con Docker

El proyecto utiliza PostgreSQL para la base de datos. Puedes levantarla usando Docker Compose:

```bash
# Opción 1: Usar Docker Compose para desarrollo
docker-compose -f docker/docker-compose.dev.yaml up -d

# Esto creará un contenedor PostgreSQL y pgAdmin con las siguientes credenciales:
# PostgreSQL:
# - Usuario: promomanager_dev
# - Contraseña: promomanager_dev
# - Base de datos: promomanager_dev
# - Puerto: 5432
# pgAdmin:
# - Email: admin@promomanager.dev
# - Contraseña: admin123
# - URL: http://localhost:5050
```

### Paso 4: Configurar variables de entorno

Copia el archivo de ejemplo de variables de entorno:

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tu configuración:

```env
# Database Configuration
DATABASE_URL="postgresql://promomanager_dev:promomanager_dev@localhost:5432/promomanager_dev?schema=public"

# Redis Configuration
REDIS_URL="redis://:promomanager_redis_dev@localhost:6379"

# Connection Pool Configuration
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Application
NODE_ENV="development"
PORT=3000

# VTEX API Configuration (opcional)
VTEX_ACCOUNT_NAME=""
VTEX_APP_KEY=""
VTEX_APP_TOKEN=""
VTEX_ENVIRONMENT="production"

# Shopify API Configuration (opcional)
SHOPIFY_SHOP_DOMAIN=""
SHOPIFY_ACCESS_TOKEN=""
SHOPIFY_API_VERSION="2024-01"
```

### Paso 5: Inicializar la base de datos

```bash
# Generar cliente de Prisma
bun run db:generate

# Crear las tablas en la base de datos
bun run db:push

# (Opcional) Ejecutar seed con datos de prueba
curl -X POST http://localhost:3000/api/seed
```

### Paso 6: Iniciar el servidor de desarrollo

```bash
# Iniciar el servidor de desarrollo en el puerto 3000
bun run dev
```

El servidor se iniciará en: **http://localhost:3000**

### Paso 7: Acceder a la aplicación

1. Abre tu navegador y navega a: `http://localhost:3000`
2. Para probar con datos de ejemplo, usa:
   - **Email**: `develop@test.com`
   - **Contraseña**: `test123`

## 🗄️ Configuración de la Base de Datos

### Opción A: Usar Docker (Recomendado para Desarrollo)

```bash
# Levantar contenedor de PostgreSQL
docker-compose -f docker/docker-compose.dev.yaml up -d

# Verificar que el contenedor está corriendo
docker ps

# Ver logs del contenedor
docker logs postgres_dev

# Detener el contenedor
docker-compose -f docker/docker-compose.dev.yaml down

# Detener y eliminar volúmenes (para limpiar todo)
docker-compose -f docker/docker-compose.dev.yaml down -v

# Iniciar Redis
docker-compose -f docker/docker-compose.dev.yaml up -d redis
```

### Opción B: Instalar PostgreSQL Localmente

Si prefieres instalar PostgreSQL directamente en tu sistema:

#### Linux (Ubuntu/Debian)

```bash
# Actualizar paquetes
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Iniciar el servicio
sudo service postgresql start

# Crear usuario y base de datos
sudo -u postgres psql
```

Dentro de psql:

```sql
-- Crear usuario
CREATE USER promomanager_dev WITH PASSWORD 'promomanager_dev';

-- Crear base de datos
CREATE DATABASE promomanager_dev OWNER promomanager_dev;

-- Conceder privilegios
GRANT ALL PRIVILEGES ON DATABASE promomanager_dev TO promomanager_dev;

-- Salir
\q
```

#### macOS (con Homebrew)

```bash
# Instalar PostgreSQL
brew install postgresql@16

# Iniciar el servicio
brew services start postgresql@16

# Crear usuario y base de datos
psql postgres
```

Dentro de psql:

```sql
-- Crear usuario
CREATE USER promomanager_dev WITH PASSWORD 'promomanager_dev';

-- Crear base de datos
CREATE DATABASE promomanager_dev OWNER promomanager_dev;

-- Conceder privilegios
GRANT ALL PRIVILEGES ON DATABASE promomanager_dev TO promomanager_dev;

-- Salir
\q
```

#### Windows

Luego usa pgAdmin (ya incluido en Docker Compose) o instala PostgreSQL desde: https://www.postgresql.org/download/windows/

Luego usa pgAdmin para crear:
- Usuario: `promomanager_dev`
- Contraseña: `promomanager_dev`
- Base de datos: `promomanager_dev`

## 🖥️ Administración con pgAdmin

pgAdmin es una herramienta de administración web para PostgreSQL que viene incluida en el Docker Compose de desarrollo. Te permite administrar visualmente tu base de datos, ejecutar consultas, ver tablas, y mucho más.

### Credenciales de pgAdmin

- **URL**: http://localhost:5050
- **Email de login**: admin@promomanager.dev
- **Contraseña**: admin123

### Paso 1: Acceder a pgAdmin

1. Asegúrate de que los contenedores Docker estén corriendo:
   ```bash
   docker-compose -f docker/docker-compose.dev.yaml ps
   ```

2. Abre tu navegador y navega a:
   ```
   http://localhost:5050
   ```

3. Ingresa tus credenciales:
   - Email: `admin@promomanager.dev`
   - Contraseña: `admin123`

### Paso 2: Configurar el servidor de PostgreSQL

Una vez que hayas iniciado sesión en pgAdmin:

1. **Crear un nuevo servidor**:
   - Clic derecho en "Servers" en el panel izquierdo
   - Selecciona "Register" → "Server..."

2. **Configurar la conexión**:
   - En la pestaña "General":
     - **Name**: PromoManager Dev (o el nombre que prefieras)

   - En la pestaña "Connection":
     - **Host name/address**: `postgres` (nombre del contenedor Docker)
     - **Port**: `5432`
     - **Maintenance database**: `promomanager_dev`
     - **Username**: `promomanager_dev`
     - **Password**: `promomanager_dev`

3. **Guardar y conectar**:
   - Clic en "Save"
   - Si todo está correcto, verás el servidor conectado en el panel izquierdo

### Paso 3: Explorar la base de datos

Una vez conectado, puedes:

- **Ver tablas**: Expande "Servers" → "PromoManager Dev" → "Databases" → "promomanager_dev" → "Schemas" → "public" → "Tables"
- **Ver datos**: Clic derecho en una tabla → "View Data" → "View All Rows"
- **Ejecutar consultas SQL**: Clic derecho en la base de datos → "Query Tool"
- **Ver estructura**: Clic derecho en una tabla → "Properties"

### Ejemplos de consultas útiles

En el Query Tool de pgAdmin, puedes ejecutar:

```sql
-- Ver todos los usuarios
SELECT * FROM "User";

-- Ver todas las promociones
SELECT * FROM "Promotion";

-- Ver métricas de promociones
SELECT p.name, p.totalViews, p.totalClicks, p.totalRedemptions
FROM "Promotion" p
ORDER BY p.totalRevenue DESC;

-- Contar promociones por tipo
SELECT type, COUNT(*) as count
FROM "Promotion"
GROUP BY type;

-- Ver promociones activas
SELECT * FROM "Promotion"
WHERE "isActive" = true;
```

### Funciones principales de pgAdmin

- **Explorador de objetos**: Navega por bases de datos, tablas, vistas, funciones, etc.
- **Query Tool**: Editor de SQL con resaltado de sintaxis y autocompletado
- **Data Editor**: Edita datos directamente en las tablas
- **Dashboard**: Monitorea el rendimiento de la base de datos
- **Backup/Restore**: Crea y restaura copias de seguridad
- **Debugger**: Depura procedimientos almacenados

### Comparación: pgAdmin vs Prisma Studio

| Característica | pgAdmin | Prisma Studio |
|---------------|---------|---------------|
| **Interfaz** | Web | Desktop |
| **Acceso** | http://localhost:5050 | http://localhost:5555 |
| **SQL nativo** | ✅ Completo | ❌ No |
| **Edición avanzada** | ✅ Tablas, datos, esquema | ⚠️ Solo datos |
| **Visualización** | ✅ Diagramas ER | ❌ No |
| **Performance** | ✅ Métricas detalladas | ❌ No |
| **Backup** | ✅ Completo | ❌ No |
| **Facilidad de uso** | ⚠️ Curva de aprendizaje | ✅ Muy intuitivo |

**Recomendación**: Usa Prisma Studio para editar datos rápidamente, y pgAdmin para tareas avanzadas, consultas SQL complejas, y administración general.

### Verificar pgAdmin

```bash
# Verificar que el contenedor de pgAdmin está corriendo
docker ps | grep pgadmin_dev

# Ver logs de pgAdmin
docker logs pgadmin_dev

# Reiniciar pgAdmin
docker restart pgadmin_dev
```

### Solución de problemas en pgAdmin

#### No puedo conectar al servidor de PostgreSQL

1. **Verificar que PostgreSQL está corriendo**:
   ```bash
   docker ps | grep postgres_dev
   ```

2. **Verificar que están en la misma red Docker**:
   ```bash
   docker network inspect my-project_promomanager
   ```

3. **Usar el nombre del contenedor como host**:
   - Host: `postgres` (NO `localhost`)
   - El contenedor pgAdmin se conecta usando el nombre del contenedor PostgreSQL

#### Error de autenticación

1. **Verificar credenciales**:
   - Usuario: `promomanager_dev`
   - Contraseña: `promomanager_dev`

2. **Verificar logs de PostgreSQL**:
   ```bash
   docker logs postgres_dev
   ```

#### pgAdmin no carga en el navegador

1. **Verificar que el contenedor está corriendo**:
   ```bash
   docker ps | grep pgadmin_dev
   ```

2. **Verificar que el puerto 5050 no está en uso**:
   ```bash
   lsof -i :5050  # macOS/Linux
   netstat -ano | findstr :5050  # Windows
   ```

3. **Limpiar caché del navegador** y recargar la página

## ⚙️ Variables de Entorno

El archivo `.env` contiene todas las configuraciones necesarias:

```env
# ==========================================
# Database Configuration
# ==========================================
# Formato: postgresql://usuario:password@host:puerto/database?schema=esquema
DATABASE_URL="postgresql://promomanager_dev:promomanager_dev@localhost:5432/promomanager_dev?schema=public"

# Connection Pool Configuration
DATABASE_POOL_MIN=2      # Mínimo de conexiones en el pool
DATABASE_POOL_MAX=10     # Máximo de conexiones en el pool

# ==========================================
# Application Settings
# ==========================================
NODE_ENV="development"   # development | production
PORT=3000                # Puerto de la aplicación

# ==========================================
# VTEX API Configuration
# ==========================================
VTEX_ACCOUNT_NAME=""     # Tu nombre de cuenta VTEX
VTEX_APP_KEY=""          # Tu App Key de VTEX
VTEX_APP_TOKEN=""        # Tu App Token de VTEX
VTEX_ENVIRONMENT="production" # production | vtexcommercestable

# ==========================================
# Shopify API Configuration
# ==========================================
SHOPIFY_SHOP_DOMAIN=""   # Tu tienda myshopify.com
SHOPIFY_ACCESS_TOKEN=""  # Tu access token de Shopify
SHOPIFY_API_VERSION="2024-01" # Versión de la API de Shopify
```

## 🚀 Ejecutar el Proyecto

### Desarrollo

```bash
# Iniciar servidor de desarrollo con hot-reload
bun run dev

# El servidor se iniciará en http://localhost:3000
# Los logs se guardarán en dev.log
```

### Verificar el servidor

```bash
# Ver logs del servidor en tiempo real
tail -f dev.log

# O usa el comando lint para verificar el código
bun run lint
```

### Abrir Prisma Studio o pgAdmin (Opcional)

```bash
# Opción 1: Abrir Prisma Studio (interfaz visual de Prisma)
bun run db:studio

# Se abrirá en http://localhost:5555

# Opción 2: Abrir pgAdmin (incluido en Docker Compose)
# Abre tu navegador en http://localhost:5050
# Credenciales: admin@promomanager.dev / admin123
```

## 📝 Comandos Disponibles

### Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
bun run dev

# Verificar código con ESLint
bun run lint

# Build de producción
bun run build

# Iniciar servidor de producción
bun run start
```

### Comandos de Base de Datos

```bash
# Generar cliente de Prisma
bun run db:generate

# Sincronizar esquema con la base de datos (crea/actualiza tablas)
bun run db:push

# Ejecutar migraciones Prisma
bun run db:migrate

# Resetear base de datos (borra todos los datos)
bun run db:reset

# Abrir Prisma Studio (interfaz visual)
bun run db:studio

# Ejecutar seed con datos de prueba
bun run db:seed
```

### Comandos Docker

```bash
# Levantar contenedores de desarrollo
docker-compose -f docker/docker-compose.dev.yaml up -d

# Ver logs de contenedores
docker-compose -f docker/docker-compose.dev.yaml logs -f

# Detener contenedores
docker-compose -f docker/docker-compose.dev.yaml down

# Detener y eliminar volúmenes (limpiar todo)
docker-compose -f docker/docker-compose.dev.yaml down -v
```

## 📊 Datos de Prueba

El proyecto incluye un endpoint de API para sembrar datos de prueba:

```bash
# Ejecutar seed con datos de prueba
curl -X POST http://localhost:3000/api/seed

# Esto creará:
# - 1 usuario de prueba (develop@test.com / test123)
# - 8 promociones de ejemplo
# - Métricas de ejemplo para cada promoción
```

### Usuario de prueba

- **Email**: `develop@test.com`
- **Contraseña**: `test123`
- **Nombre**: Develop User
- **Empresa**: Test Company

### Promociones de prueba

El seed crea 8 promociones con diferentes:
- Tipos de segmentación (comportamiento, historial, carrito, primera compra)
- Tipos de descuento (porcentaje, monto fijo, envío gratis)
- Estados (activa, inactiva, programada, expirada)
- Métricas de rendimiento

## 🎯 Características

### 🔐 Sistema de Autenticación
- Login y registro de usuarios
- Recuperación de contraseña
- Avatar personalizable (logo o iniciales)
- Preferencias de email (promociones, métricas, actualizaciones, tips)
- Persistencia de sesión con localStorage
- Contraseñas con hash SHA256

### 🏪 Gestión de Promociones
- CRUD completo de promociones
- 4 tipos de segmentación:
  - Basada en Comportamiento (5+ compras recientes)
  - Basada en Historial (compras totales > $500)
  - Abandono de Carrito
  - Primera Compra
- 3 tipos de descuento:
  - Porcentaje
  - Monto fijo
  - Envío gratis
- Paginación inteligente (6 por página)
- Búsqueda en tiempo real (nombre y descripción)
- 3 tipos de filtros combinables:
  - Estado (Activa, Inactiva, Programada, Expirada)
  - Tipo de promoción
  - Tipo de descuento
- Métricas detalladas por promoción:
  - Vistas, Clics, Redenciones, Ingresos
  - Métricas diarias para gráficos

### 📊 Dashboard Overview
- Métricas en tiempo real
- Gráficos de rendimiento
- Últimas 5 promociones con botón "Ver todas"
- Resumen de métricas agregadas:
  - Total de promociones
  - Vistas totales
  - Clics totales
  - Redenciones totales
  - Ingresos totales

### ⚙️ Configuración de Tienda
- Configuración para VTEX y Shopify
- Credenciales seguras
- Actualización dinámica de configuración

### 👤 Perfil de Usuario
- Editar nombre, empresa, teléfono
- Subir avatar personalizable
- Preferencias de email con 4 categorías

## 🏗️ Tecnologías

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript 5
- **Runtime**: Bun
- **Estilos**: Tailwind CSS 4
- **UI**: shadcn/ui (Radix UI + Tailwind)
- **Animaciones**: Framer Motion 12.23.2
- **Estado Global**: Zustand 5.0.6
- **Formularios**: React Hook Form 7.60.0
- **Validación**: Zod 4.0.2
- **Notificaciones**: Sonner 2.0.6

### Backend
- **Framework**: Next.js 15
- **ORM**: Prisma 6.11.1
- **Database**: PostgreSQL 16
- **Node.js**: pg 8.13.1

### DevOps
- **Contenedor**: Docker Compose
- **Versión PostgreSQL**: 16-alpine (desarrollo)
- **Healthchecks**: pg_isready

## 🔍 Solución de Problemas

### Problema: El puerto 3000 ya está en uso

```bash
# Ver qué proceso está usando el puerto 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Matar el proceso
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Problema: No se puede conectar a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
docker ps  # Si usas Docker
sudo service postgresql status  # Si usas instalación local

# Verificar que el puerto 5432 está abierto
netstat -tlnp | grep 5432  # Linux
netstat -an | grep 5432  # macOS

# Ver logs de PostgreSQL
docker logs postgres_dev  # Docker
sudo tail -f /var/log/postgresql/postgresql-16-main.log  # Linux
tail -f /usr/local/var/log/postgres.log  # macOS
```

### Problema: Error de conexión a la base de datos

Verifica tu `.env`:

```env
# Asegúrate de que el formato sea correcto
DATABASE_URL="postgresql://usuario:password@host:puerto/database?schema=public"

# Ejemplo para Docker con las credenciales del docker-compose.dev.yaml
DATABASE_URL="postgresql://promomanager_dev:promomanager_dev@localhost:5432/promomanager_dev?schema=public"
```

### Problema: Los cambios en el esquema no se reflejan

```bash
# Regenerar cliente de Prisma
bun run db:generate

# Sincronizar con la base de datos
bun run db:push

# Reiniciar el servidor de desarrollo
# Detén el servidor con Ctrl+C y ejecuta:
bun run dev
```

### Problema: Error de dependencias

```bash
# Limpiar cache e reinstalar
rm -rf node_modules
rm bun.lockb
bun install
```

### Problema: Permiso denegado en archivos

```bash
# Dar permisos de ejecución si es necesario
chmod +x seed.sh
```

### Verificar espacio en disco

```bash
# Verificar espacio disponible
df -h
```

### Verificar memoria disponible

```bash
# Verificar memoria
free -h  # Linux
vm_stat  # macOS
```

## 📚 Documentación Adicional

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Bun Docs](https://bun.sh/docs)

## 📝 Estructura del Proyecto

```
my-project/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   └── page.tsx        # Página principal
│   ├── components/         # Componentes React
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── dashboard/     # Componentes del dashboard
│   │   └── ui/            # Componentes shadcn/ui
│   ├── hooks/             # Custom React Hooks
│   ├── lib/               # Utilidades y configuraciones
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── docker/
│   ├── docker-compose.dev.yaml    # Configuración desarrollo
│   └── docker-compose.prod.yaml   # Configuración producción
├── scripts/               # Scripts utilitarios
├── public/               # Archivos estáticos
└── docs/                 # Documentación adicional
```

## 🚀 Próximos Pasos

1. [x] Instalar dependencias
2. [x] Configurar base de datos
3. [x] Configurar variables de entorno
4. [x] Ejecutar migraciones
5. [x] Iniciar servidor de desarrollo
6. [ ] Explorar la aplicación
7. [ ] Personalizar tu configuración
8. [ ] Crear tus primeras promociones

## 💡 Tips de Desarrollo

### Hot Module Replacement

El servidor de desarrollo incluye hot-reload automático. Cuando guardas cambios en los archivos, la página se recarga automáticamente.

### Base de Datos Local

Tienes dos opciones para administrar visualmente la base de datos:

**Opción 1: Prisma Studio** (más intuitivo, para ediciones rápidas)
```bash
bun run db:studio
# Se abre en http://localhost:5555
```

**Opción 2: pgAdmin** (incluido en Docker Compose, para tareas avanzadas)
```bash
# Abre tu navegador en http://localhost:5050
# Credenciales: admin@promomanager.dev / admin123
```

Elige según necesites:
- **Prisma Studio**: Para editar datos rápidamente sin SQL
- **pgAdmin**: Para consultas SQL complejas, administración avanzada, y monitoreo de rendimiento

### Logs

El servidor guarda logs en `dev.log`. Puedes verlos en tiempo real con:

```bash
tail -f dev.log
```

### Linting

Antes de hacer commit, ejecuta:

```bash
bun run lint
```

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 🆘 Soporte

Si encuentras algún problema:

1. Verifica que PostgreSQL esté corriendo
2. Verifica que el puerto 3000 esté disponible
3. Verifica tu configuración en `.env`
4. Revisa los logs en `dev.log`
5. Consulta la sección de [Solución de Problemas](#-solución-de-problemas)

Para preguntas o sugerencias, abre un issue en el repositorio.

---

Made with ❤️ por PromoManager Team
