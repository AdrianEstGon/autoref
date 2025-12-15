# 🚀 Setup Inicial - AutoRef

Esta guía te llevará paso a paso para configurar y desplegar el sistema completo desde cero.

---

## ✅ Checklist de Preparación

Antes de comenzar, asegúrate de tener:

- [ ] Cuenta de Railway (base de datos)
- [ ] Cuenta de Vercel (frontend) o plataforma alternativa
- [ ] Cuenta de Railway/Render (backend) o plataforma alternativa
- [ ] Cuenta de Cloudinary
- [ ] Google Maps API Key
- [ ] Cuenta de Gmail configurada para SMTP

---

## 📝 Paso 1: Configurar Base de Datos Railway

### **1.1 Crear Base de Datos**

1. Ve a [railway.app](https://railway.app)
2. Click en "New Project" → "Provision MySQL" (o SQL Server si lo prefieres)
3. Anota las credenciales:
   ```
   Host: centerbeam.proxy.rlwy.net
   Port: 44269
   Database: railway
   Username: root
   Password: [anota este password]
   ```

### **1.2 Verificar Conexión**

Usa un cliente SQL (Azure Data Studio, DBeaver, etc.) para verificar que puedes conectarte.

---

## 🔧 Paso 2: Configurar Backend Local

### **2.1 Clonar Repositorio**

```bash
git clone [tu-repositorio]
cd autoref
```

### **2.2 Configurar Variables de Entorno**

```bash
cd backend
Copy-Item env.example .env
```

Edita `.env` con tus credenciales:

```env
# Base de Datos
DB_HOST=centerbeam.proxy.rlwy.net
DB_PORT=44269
DB_NAME=railway
DB_USER=root
DB_PASSWORD=TU_PASSWORD_DE_RAILWAY

# JWT (cambiar en producción)
JWT_KEY=CambiaEstaPorUnaClaveSecretaLargaYSegura123456789
JWT_ISSUER=AutoRefAPI
JWT_AUDIENCE=AutoRefClient

# Cloudinary (obtener de cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Google Maps (obtener de console.cloud.google.com)
GOOGLE_MAPS_API_KEY=tu_google_maps_key

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password

# Configuración
PORT=10000
ASPNETCORE_ENVIRONMENT=Development
FRONTEND_URL=http://localhost:3000
```

### **2.3 Restaurar Dependencias**

```bash
dotnet restore
```

### **2.4 Aplicar Migraciones**

```bash
# Opción 1: Usar el script (Windows)
.\apply-migrations.ps1

# Opción 2: Manual
$env:DB_CONNECTION_STRING="Server=centerbeam.proxy.rlwy.net,44269;Database=railway;User Id=root;Password=TU_PASSWORD;TrustServerCertificate=True;Encrypt=False;"
dotnet ef database update
```

### **2.5 Ejecutar Backend**

```bash
dotnet run
```

✅ Verifica que el backend funcione:
- Swagger: http://localhost:10000

---

## 💻 Paso 3: Configurar Frontend Local

### **3.1 Navegar al Frontend**

```bash
cd ../webapp
```

### **3.2 Configurar Variables de Entorno**

```bash
Copy-Item env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:10000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_key
```

### **3.3 Instalar Dependencias**

```bash
npm install
```

### **3.4 Ejecutar Frontend**

```bash
npm run dev
```

✅ Verifica que el frontend funcione:
- App: http://localhost:3000

---

## 🎯 Paso 4: Crear Usuario Admin Inicial

### **4.1 Crear Usuario desde Swagger**

1. Ve a http://localhost:10000
2. Busca el endpoint `POST /api/Usuarios/register`
3. Ejecuta con estos datos:

```json
{
  "nombre": "Admin",
  "primerApellido": "Sistema",
  "segundoApellido": "",
  "fechaNacimiento": "1990-01-01",
  "nivel": "Nacional",
  "clubVinculadoId": null,
  "licencia": "ADMIN001",
  "email": "admin@autoref.com",
  "username": "admin",
  "password": "Admin123!",
  "direccion": "Calle Principal 1",
  "pais": "España",
  "region": "Asturias",
  "ciudad": "Oviedo",
  "codigoPostal": "33001",
  "esAdmin": true
}
```

### **4.2 Login**

1. Ve a http://localhost:3000
2. Login con:
   - **Username:** `admin`
   - **Password:** `Admin123!`

---

## ☁️ Paso 5: Deployment Backend (Railway)

### **5.1 Crear Servicio en Railway**

1. Ve a tu proyecto en Railway
2. Click "New Service" → "GitHub Repo"
3. Selecciona tu repositorio
4. Railway detectará el Dockerfile automáticamente

### **5.2 Configurar Variables de Entorno**

En Railway, agrega TODAS las variables del archivo `backend/env.example`:

```env
DB_HOST=centerbeam.proxy.rlwy.net
DB_PORT=44269
DB_NAME=railway
DB_USER=root
DB_PASSWORD=tu_password
JWT_KEY=CambiaEstaPorUnaClaveSecretaLargaYSegura123456789
JWT_ISSUER=AutoRefAPI
JWT_AUDIENCE=AutoRefClient
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
GOOGLE_MAPS_API_KEY=tu_google_maps_key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password
PORT=10000
ASPNETCORE_ENVIRONMENT=Production
FRONTEND_URL=https://tu-frontend-url.vercel.app
```

### **5.3 Configurar Root Directory**

En Railway Settings:
- **Root Directory:** `backend`
- **Dockerfile Path:** `backend/Dockerfile`

### **5.4 Deploy**

Railway hará deploy automáticamente. Anota la URL:
```
https://tu-backend.railway.app
```

### **5.5 Verificar**

Visita:
- https://tu-backend.railway.app (debería mostrar Swagger)

---

## 🌐 Paso 6: Deployment Frontend (Vercel)

### **6.1 Conectar Repositorio**

1. Ve a [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Importa tu repositorio de GitHub

### **6.2 Configurar Proyecto**

- **Framework Preset:** Next.js
- **Root Directory:** `webapp`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### **6.3 Configurar Variables de Entorno**

```env
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_key
```

### **6.4 Deploy**

Click en "Deploy". Vercel hará el build y deploy automáticamente.

### **6.5 Verificar**

Visita tu URL de Vercel:
```
https://tu-frontend.vercel.app
```

---

## 🔄 Paso 7: Actualizar CORS en Backend

Después de desplegar el frontend, **actualiza la variable de entorno en Railway**:

```env
FRONTEND_URL=https://tu-frontend.vercel.app
```

Y re-deploya el backend.

---

## ✅ Verificación Final

### **Backend**
- [ ] Swagger accesible
- [ ] Endpoints responden correctamente
- [ ] Base de datos conectada
- [ ] Migraciones aplicadas

### **Frontend**
- [ ] Página de login carga
- [ ] Login funciona
- [ ] Google Maps se carga
- [ ] Imágenes se suben (Cloudinary)
- [ ] Navegación funciona

### **Integración**
- [ ] Frontend se conecta al backend
- [ ] CORS configurado correctamente
- [ ] Notificaciones funcionan
- [ ] Emails se envían

---

## 🐛 Troubleshooting Común

### **Error: Cannot connect to database**

**Solución:**
```bash
# Verificar connection string
$env:DB_CONNECTION_STRING="Server=centerbeam.proxy.rlwy.net,44269;Database=railway;User Id=root;Password=TU_PASSWORD;TrustServerCertificate=True;Encrypt=False;"

# Test de conexión
dotnet ef database update
```

### **Error: CORS policy**

**Solución:**
1. Verifica `FRONTEND_URL` en Railway
2. Asegúrate de usar HTTPS en producción
3. Re-deploya el backend

### **Error: Google Maps no carga**

**Solución:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Habilita "Maps JavaScript API" y "Geocoding API"
3. Agrega restricciones de dominio:
   - `localhost:3000`
   - `tu-frontend.vercel.app`

### **Error: JWT Authentication fails**

**Solución:**
1. Verifica que `JWT_KEY` tenga al menos 32 caracteres
2. Asegúrate de que `JWT_ISSUER` y `JWT_AUDIENCE` sean iguales en ambos entornos

### **Error: Migrations fail**

**Solución:**
```bash
# Eliminar todas las migraciones
Remove-Item -Path Migrations -Recurse -Force

# Crear nueva migración
dotnet ef migrations add InitialCreate

# Aplicar
dotnet ef database update
```

---

## 📊 Monitoreo Post-Deployment

### **Railway (Backend)**
1. Ve a tu proyecto en Railway
2. Click en el servicio backend
3. Ve a "Logs" para ver logs en tiempo real

### **Vercel (Frontend)**
1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Click en el deployment actual → "View Function Logs"

---

## 🔐 Seguridad Post-Deployment

### **Checklist de Seguridad**

- [ ] Cambiar `JWT_KEY` por una clave única y segura
- [ ] Usar HTTPS en producción
- [ ] Configurar CORS para dominios específicos
- [ ] Rotar API Keys de servicios externos
- [ ] Habilitar autenticación de dos factores en cuentas críticas
- [ ] Backup automático de base de datos
- [ ] Monitoreo de logs y errores

---

## 📞 Soporte

Si tienes problemas durante el setup:

1. **Revisa los logs:**
   - Backend: Railway Dashboard → Logs
   - Frontend: Vercel Dashboard → Logs
   - Browser: DevTools → Console

2. **Documentación adicional:**
   - [Backend Deployment Guide](./backend/DEPLOYMENT_GUIDE.md)
   - [Frontend Deployment Guide](./webapp/DEPLOYMENT_GUIDE.md)
   - [README Principal](./README.md)

3. **Errores comunes:**
   - Verifica que todas las variables de entorno estén configuradas
   - Asegúrate de que los puertos estén correctos
   - Revisa que las URLs no tengan espacios o caracteres especiales

---

## 🎉 ¡Felicidades!

Si llegaste hasta aquí, tu sistema AutoRef está completamente configurado y desplegado.

### **Próximos Pasos:**

1. Crear usuarios árbitros
2. Crear categorías y equipos
3. Crear polideportivos
4. Crear partidos
5. Configurar disponibilidades
6. Hacer asignaciones de árbitros

---

**¡Disfruta tu sistema de gestión de árbitros! ⚽🏆**

