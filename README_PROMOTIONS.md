# Dashboard de Gestión de Promociones

Dashboard completo para gestionar promociones en tiendas VTEX y Shopify, con métricas detalladas y análisis de rendimiento.

## 🚀 Características

### Setup Inicial
- **Selección de Plataforma**: Elige entre VTEX o Shopify para integrar tu tienda
- **Configuración Personalizada**: Formularios específicos para cada plataforma con los campos requeridos

### Dashboard Principal
- **Vista General**: Resumen de métricas clave con estadísticas en tiempo real
- **Métricas Detalladas**:
  - Vistas totales de promociones
  - Clics y tasas de conversión (CTR)
  - Redenciones y valor promedio de orden
  - Ingresos generados por promoción

### Gestión de Promociones
- **Creación de Promociones**:
  - Tipos de segmentación: Comportamiento, Historial, Abandono de Carrito, Primera Compra
  - Configuración de descuentos: Porcentaje, Monto fijo, Envío gratis
  - Programación con fechas de inicio y fin
  - Priorización de promociones

- **Lista de Promociones**:
  - Vista de todas las promociones con métricas
  - Estado visual (Activa, Inactiva, Programada, Expirada)
  - Acciones rápidas: Editar, Eliminar
  - Métricas por tarjeta: Vistas, Clics, Redenciones, Ingresos

- **Edición**: Modifica cualquier aspecto de una promoción existente
- **Eliminación**: Elimina promociones con confirmación de seguridad

### Análisis y Métricas
- **Resumen General**: Métricas agregadas de todas las promociones
- **Promedios**: Comparación del rendimiento promedio por promoción
- **Distribución**: Visualización de promociones por tipo de segmentación
- **Insights**: Indicadores de rendimiento con tendencias

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Componentes UI**: shadcn/ui (Radix UI)
- **Animaciones**: Framer Motion
- **Estado Global**: Zustand
- **Base de Datos**: Prisma ORM con SQLite
- **Formularios**: React Hook Form con Zod
- **Notificaciones**: Sonner (Toast)
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── store/
│   │   │   └── route.ts          # API para configuración de tienda
│   │   └── promotions/
│   │       ├── route.ts          # API CRUD de promociones
│   │       └── [id]/route.ts     # API de promoción individual
│   └── page.tsx                  # Página principal
├── components/
│   ├── dashboard/
│   │   ├── DashboardNav.tsx      # Navegación lateral
│   │   ├── DashboardOverview.tsx # Vista general del dashboard
│   │   ├── MetricsSummary.tsx     # Resumen de métricas
│   │   ├── PromotionForm.tsx      # Formulario de creación/edición
│   │   ├── PromotionList.tsx      # Lista de promociones
│   │   └── PromotionMetrics.tsx   # Métricas detalladas
│   ├── setup/
│   │   ├── PlatformSelector.tsx   # Selector de plataforma
│   │   └── StoreConfigForm.tsx   # Formulario de configuración
│   └── ui/                       # Componentes shadcn/ui
├── store/
│   └── use-store.ts              # Estado global con Zustand
├── types/
│   └── promotion.ts              # Definición de tipos TypeScript
└── lib/
    ├── db.ts                     # Cliente de Prisma
    └── utils.ts                  # Utilidades
```

## 🎨 Diseño

- **Minimalista**: Interfaz limpia y enfocada en la usabilidad
- **Responsivo**: Optimizado para móvil, tablet y desktop
- **Animaciones**: Transiciones suaves con Framer Motion
- **Paleta de colores**: Sistema de colores Tailwind sin usar azul/indigo
- **Accesibilidad**: Componentes con soporte ARIA y navegación por teclado

## 📊 Modelos de Datos

### Store
Configuración de la tienda conectada (VTEX o Shopify)

### Promotion
Promociones creadas por el usuario con:
- Información básica (nombre, descripción)
- Tipo de segmentación
- Configuración de descuento
- Fechas de programación
- Estado y prioridad
- Métricas acumuladas

### PromotionMetric
Métricas diarias de cada promoción para análisis temporal

## 🔄 Flujo de la Aplicación

1. **Setup Inicial**
   - Selección de plataforma (VTEX/Shopify)
   - Configuración de credenciales
   - Guardado en base de datos

2. **Dashboard**
   - Vista general con métricas
   - Gestión de promociones
   - Creación de nuevas promociones
   - Análisis de rendimiento

## 🚀 Próximas Mejoras Posibles

- Integración real con APIs de VTEX y Shopify
- Exportación de reportes en PDF/Excel
- Gráficos temporales de métricas
- Segmentación avanzada de usuarios
- A/B testing de promociones
- Notificaciones push
- Integración con email marketing
- Autenticación de usuarios
- Roles y permisos
