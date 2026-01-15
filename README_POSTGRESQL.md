# 🗄️ Migración de SQLite a PostgreSQL

Guía rápida para migrar PromoManager a PostgreSQL.

## 📋 Pasos Rápidos

### 1. Instalar PostgreSQL y Dependencias
```bash
# Instalar dependencias
bun add pg better-sqlite3
bun add -d @types/pg

# Generar Prisma Client
bun run db:generate
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos y usuario
createdb promomanager
createuser promomanager -P

# Configurar .env
cp .env.example .env

# Editar DATABASE_URL
nano .env
# DATABASE_URL="postgresql://promomanager:password@localhost:5432/promomanager"
```

### 3. Ejecutar Migraciones
```bash
# Crear tablas en PostgreSQL
bun run db:migrate

# O usar push para desarrollo
bun run db:push
```

### 4. Migrar Datos
```bash
# Ejecutar script de migración
bun run migrate:sqlite-to-postgres
```

### 5. Verificar
```bash
# Usar Prisma Studio
bun run db:studio

# O consultar con psql
psql -h localhost -U promomanager -d promomanager
```

## 📊 Comparativa: SQLite vs PostgreSQL

| Característica | SQLite | PostgreSQL |
|---------------|---------|------------|
| Escalabilidad | ⚠️ Limitado | ✅ Ilimitado |
| Concurrentes | ⚠️ Writes serie | ✅ Writes paralelo |
| Backup | ❌ Manual | ✅ Automático |
| Replicación | ❌ No | ✅ Sí |
| JSON Support | ✅ Nativo | ✅ Nativo + JSONB |
| Full Text Search | ⚠️ Básico | ✅ Avanzado |
| Performance | ✅ Excelente DB chica | ✅ Escala con HW |

## 🔧 Troubleshooting Común

### Error de conexión
```bash
# Verificar que PostgreSQL corra
sudo service postgresql status

# Verificar puerto
sudo netstat -tlnp | grep 5432
```

### Error de autenticación
```bash
# Cambiar contraseña
psql -U postgres
ALTER USER promomanager WITH PASSWORD 'nueva_password';
```

### Error de schema
```bash
# Regenerar cliente
bun run db:generate

# Re-ejecutar migraciones
bun run db:migrate
```

## 📚 Más Información

Ver documentación completa: `docs/POSTGRESQL_MIGRATION.md`

Documentación de Prisma: https://www.prisma.io/docs/concepts/database-connectors/postgresql
