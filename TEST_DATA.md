# 📋 Datos de Prueba - PromoManager

## 🌱 Ejecutar Seed

### Usando el script (recomendado):
```bash
./seed.sh
```

### Usando curl directamente:
```bash
curl -X POST http://localhost:3000/api/seed
```

### Verificar estado del seed:
```bash
curl http://localhost:3000/api/seed
```

## 👤 Usuario de Prueba

```
Email:    develop@test.com
Password: test123
```

**Información del Usuario:**
- Nombre: Develop User
- Empresa: Test Company
- Preferencias de email: Todas activadas (promociones, métricas, actualizaciones, tips)
- Avatar: No configurado (se mostrarán iniciales "DU")

## 🏪 Tienda Configurada

**Plataforma:** VTEX
```
Cuenta: developstore
App Key: vtexappkey-test-key
App Token: vtexapptoken-test-token
Environment: production
```

## 🎯 Promociones de Prueba (9 total)

### 1. Oferta de Verano - Clientes Recurrentes
- **Tipo:** Basada en Comportamiento
- **Descuento:** 15%
- **Estado:** Activa
- **Prioridad:** 10
- **Vistas:** 12,543
- **Clics:** 3,421
- **Redenciones:** 892
- **Ingresos:** $45,230.50

### 2. Descuento Primera Compra
- **Tipo:** Primera Compra
- **Descuento:** 20%
- **Estado:** Activa
- **Prioridad:** 5
- **Vistas:** 8,932
- **Clics:** 2,156
- **Redenciones:** 678
- **Ingresos:** $18,950.00

### 3. Recupera tu Carrito
- **Tipo:** Abandono de Carrito
- **Descuento:** 10%
- **Estado:** Activa
- **Prioridad:** 8
- **Vistas:** 5,678
- **Clics:** 1,432
- **Redenciones:** 389
- **Ingresos:** $12,890.75

### 4. VIP - Compras Anteriores
- **Tipo:** Basada en Historial
- **Descuento:** $50 (fijo)
- **Estado:** Inactiva
- **Prioridad:** 15
- **Vistas:** 2,341
- **Clics:** 678
- **Redenciones:** 156
- **Ingresos:** $7,800.00

### 5. Envío Gratis - Temporada
- **Tipo:** Basada en Comportamiento
- **Descuento:** Envío Gratis
- **Estado:** Activa
- **Prioridad:** 7
- **Vistas:** 10,234
- **Clics:** 4,123
- **Redenciones:** 1,234
- **Ingresos:** $156,780.00

### 6. Flash Sale - Fin de Semana
- **Tipo:** Basada en Comportamiento
- **Descuento:** 25%
- **Estado:** Activa (Programada)
- **Prioridad:** 20
- **Vistas:** 0
- **Clics:** 0
- **Redenciones:** 0
- **Ingresos:** $0.00
- **Nota:** Esta promoción comienza en 2 días

### 7. Bienvenida - Regalo
- **Tipo:** Primera Compra
- **Descuento:** $10 (fijo)
- **Estado:** Expirada
- **Prioridad:** 3
- **Vistas:** 15,678
- **Clics:** 5,234
- **Redenciones:** 2,345
- **Ingresos:** $23,450.00
- **Nota:** Esta promoción expiró hace 60 días

### 8. Lealtad - 3 Compras
- **Tipo:** Basada en Historial
- **Descuento:** 12%
- **Estado:** Activa
- **Prioridad:** 12
- **Vistas:** 4,521
- **Clics:** 1,823
- **Redenciones:** 456
- **Ingresos:** $22,100.25

### 9. Lealtad - 3 Compras (duplicado de prueba)
- **Tipo:** Basada en Historial
- **Descuento:** 12%
- **Estado:** Activa
- **Prioridad:** 12
- **Vistas:** 4,521
- **Clics:** 1,823
- **Redenciones:** 456
- **Ingresos:** $22,100.25

## 📊 Métricas de Prueba

- **Total de Métricas:** 142
- **Período:** 30 días de datos históricos
- **Actualización:** Diaria para cada promoción activa

## 🎨 Escenarios de Prueba

### 1. Login Exitoso
```
Email: develop@test.com
Password: test123
```
→ Debería acceder al dashboard directamente (ya tiene tienda configurada)

### 2. Dashboard Overview
→ Ver 8 promociones activas
→ Métricas agregadas en tiempo real
→ Distribución por tipo de promoción

### 3. Lista de Promociones
→ Ver todas las promociones con sus estados:
  - ✅ Activas (6)
  - ⏸️ Programadas (1)
  - ⏹️ Inactivas (1)
  - ⏰ Expiradas (1)

### 4. Crear Promoción
→ Probar creación de cada tipo:
  - Basada en Comportamiento
  - Basada en Historial
  - Abandono de Carrito
  - Primera Compra

### 5. Editar Promoción
→ Probar editar:
  - Nombre y descripción
  - Tipo de descuento y valor
  - Fechas de programación
  - Prioridad

### 6. Eliminar Promoción
→ Probar eliminar con confirmación de diálogo

### 7. Configuración de Tienda
→ Verificar datos de VTEX cargados
→ Modificar credenciales
→ Guardar cambios

### 8. Perfil de Usuario
→ Cambiar nombre y empresa
→ Subir avatar
→ Configurar preferencias de email

### 9. Preferencias de Email
→ Activar/desactivar cada opción:
  - Promociones
  - Métricas
  - Actualizaciones
  - Consejos y Mejores Prácticas

### 10. Logout
→ Cerrar sesión
→ Volver a iniciar sesión
→ Verificar persistencia de datos

## 📈 Datos Estadísticos Totales

- **Vistas Totales:** ~64,752
- **Clics Totales:** ~24,690
- **Redenciones Totales:** ~6,550
- **Ingresos Totales:** ~$309,201.75
- **CTR Promedio:** ~38%
- **Conversión Promedio:** ~26.5%
- **Valor Promedio por Orden:** ~$47.19

## 🔄 Resetear Base de Datos

Para eliminar todos los datos de prueba y empezar desde cero:

```bash
rm /home/z/my-project/db/custom.db
bun run db:push
./seed.sh
```

## 💡 Tips para Testing

1. **Testea responsive:** Redimensiona el navegador para probar móvil/tablet
2. **Testea animaciones:** Observa las transiciones entre vistas
3. **Testea estados:** Crea promociones con diferentes estados
4. **Testea validaciones:** Intenta crear promociones sin datos requeridos
5. **Testea errores:** Usa credenciales incorrectas en el login
6. **Testea persistencia:** Recarga la página y verifica que los datos se mantengan
7. **Testea avatar:** Sube diferentes imágenes y verifica las iniciales

## 🎯 Próximos Tests Sugeridos

1. Testear creación de múltiples promociones
2. Testear ordenamiento por prioridad
3. Testear filtros de búsqueda (cuando se implementen)
4. Testear exportación de datos (cuando se implemente)
5. Testear notificaciones por email (cuando se integre)
6. Testear integración real con APIs de VTEX/Shopify
7. Testear roles y permisos (cuando se implementen)
