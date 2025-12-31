# GUÍA DE INICIO - AutoRef

## ✅ Estado Actual

Se ha creado:
- ✅ Backend completo (Node.js + Express + TypeScript + Prisma)
- ✅ Sistema de autenticación con JWT
- ✅ API de gestión de personas
- ✅ Frontend (Next.js 14 + TypeScript + Tailwind CSS)
- ✅ Interfaz de login moderna y elegante
- ✅ Dashboard básico

## 📋 Pasos para iniciar el proyecto

### 1. Instalar dependencias del Frontend

```powershell
cd c:\Users\ruben\Desktop\autoref\webapp
npm install
```

### 2. Configurar PostgreSQL local (opcional para desarrollo)

Si no tienes PostgreSQL instalado y quieres usar Railway desde el principio, sáltate este paso y usa la URL de Railway en el `.env` del backend.

Para desarrollo local con PostgreSQL:
- Instala PostgreSQL: https://www.postgresql.org/download/windows/
- Crea una base de datos llamada `autoref_dev`
- El `.env` del backend ya está configurado para localhost

### 3. Inicializar la base de datos con Prisma

```powershell
cd c:\Users\ruben\Desktop\autoref\backend
npm run prisma:push
```

Este comando crea las tablas en la base de datos según el esquema de Prisma.

### 4. Crear usuario administrador inicial

Ejecuta este script en Node.js para crear el usuario admin:

```powershell
cd c:\Users\ruben\Desktop\autoref\backend
node -e "const bcrypt=require('bcryptjs');const pw=bcrypt.hashSync('admin123',10);console.log('Hash:',pw)"
```

Luego ejecuta este SQL en tu base de datos (puedes usar `npm run prisma:studio` para abrir la interfaz):

```sql
INSERT INTO usuarios (id, email, password, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@federacion.com',
  '<PEGA_AQUI_EL_HASH_GENERADO>',
  'FEDERACION',
  true,
  NOW(),
  NOW()
);
```

O más fácil, usa este script de Node.js:

Crea el archivo `backend/scripts/create-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@federacion.com',
      password: hashedPassword,
      rol: 'FEDERACION',
      activo: true
    }
  })

  console.log('✅ Usuario admin creado:', admin.email)
  console.log('📧 Email: admin@federacion.com')
  console.log('🔑 Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Luego ejecútalo:

```powershell
cd c:\Users\ruben\Desktop\autoref\backend
node scripts/create-admin.js
```

### 5. Iniciar el backend

En una terminal:

```powershell
cd c:\Users\ruben\Desktop\autoref\backend
npm run dev
```

El backend estará corriendo en: http://localhost:3001

### 6. Iniciar el frontend

En OTRA terminal (nueva):

```powershell
cd c:\Users\ruben\Desktop\autoref\webapp
npm run dev
```

El frontend estará corriendo en: http://localhost:3000

### 7. Probar la aplicación

1. Abre tu navegador en http://localhost:3000
2. Inicia sesión con:
   - **Email:** admin@federacion.com
   - **Password:** admin123

## 🎨 Características implementadas

### Backend
- ✅ Autenticación con JWT
- ✅ CRUD completo de personas
- ✅ Middleware de autenticación y autorización
- ✅ Validación de datos con Zod
- ✅ Manejo de errores centralizado
- ✅ Soft deletes (borrado lógico)

### Frontend
- ✅ Login responsive y elegante
- ✅ Dashboard con navegación
- ✅ Context API para autenticación
- ✅ Interceptors de Axios para manejar tokens
- ✅ Protección de rutas
- ✅ Diseño moderno con Tailwind CSS

## 📊 Modelo de datos actual

```
Usuario
├── email (único)
├── password (hasheado con bcrypt)
├── rol (FEDERACION | COMITE_ARBITROS | CLUB | ARBITRO)
└── persona (relación opcional)

Persona
├── nombre, apellidos, DNI
├── fecha de nacimiento
├── contacto (teléfono, email, dirección)
├── tipo (JUGADOR | TECNICO | ARBITRO | DIRECTIVO)
└── licencias, habilitaciones

Temporada, Modalidad, Categoria, Licencia, Habilitacion
```

## 🔄 Próximos pasos

1. ✅ Módulo de Personas (completar la interfaz)
2. ⏳ Módulo de Clubes y Equipos
3. ⏳ Módulo de Competiciones
4. ⏳ Y seguir con el análisis funcional...

## 🐛 Troubleshooting

### Error: Cannot find module '@prisma/client'
```powershell
cd backend
npm run prisma:generate
```

### Error: Port 3001 already in use
```powershell
# Cambiar el puerto en backend/.env
PORT=3002
```

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo
- Verifica la URL en `backend/.env`
- Para usar Railway: actualiza DATABASE_URL con la URL de tu base de datos en Railway

## 📝 Notas importantes

- El archivo `.env` del backend NO está en .gitignore para facilitar el desarrollo local
- Antes de subir a GitHub, asegúrate de agregarlo al .gitignore
- Las contraseñas están hasheadas con bcrypt (10 rounds)
- Los tokens JWT expiran en 7 días
- CORS está configurado para localhost:3000

## 🚀 Deploy

### Backend (Render)
1. Conecta tu repositorio en Render
2. Variables de entorno necesarias:
   - `DATABASE_URL` (de Railway)
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (URL de Vercel)

### Frontend (Vercel)
1. Conecta tu repositorio en Vercel
2. Variables de entorno:
   - `NEXT_PUBLIC_API_URL` (URL de Render)

¡Todo listo para empezar a desarrollar! 🎉
