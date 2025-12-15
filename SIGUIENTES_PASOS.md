# 🎯 Siguientes Pasos - AutoRef

## ✅ ¿Qué se ha completado?

1. ✅ Carpeta `AutoRef_API` renombrada a `backend`
2. ✅ Configuración de base de datos migrada a Railway
3. ✅ Variables de entorno implementadas en backend y frontend
4. ✅ CORS dinámico configurado
5. ✅ Dockerfiles actualizados
6. ✅ Scripts de migraciones creados
7. ✅ Documentación completa generada

---

## 🚀 ¿Qué debes hacer AHORA?

### **Paso 1: Obtener Password de Railway** ⏰ 5 min

1. Ve a [railway.app](https://railway.app)
2. Localiza tu base de datos SQL Server
3. En la pestaña "Connect", anota el **PASSWORD**

---

### **Paso 2: Aplicar Migraciones a Railway** ⏰ 10 min

**Opción A: Usar el Script (Recomendado)**

```powershell
cd backend
.\apply-migrations.ps1
```

El script te preguntará:
1. Password de Railway (el que anotaste)
2. Qué hacer:
   - **Opción 1:** Aplicar migraciones existentes (si ya tienes la carpeta `Migrations/`)
   - **Opción 3:** Recrear todo (si la base de datos está vacía)

**Opción B: Manual**

```powershell
cd backend

# Configurar connection string
$env:DB_CONNECTION_STRING="Server=centerbeam.proxy.rlwy.net,44269;Database=railway;User Id=root;Password=TU_PASSWORD_AQUI;TrustServerCertificate=True;Encrypt=False;"

# Aplicar migraciones
dotnet ef database update
```

**✅ Verifica:** Conéctate a Railway con un cliente SQL y verifica que las tablas se crearon.

---

### **Paso 3: Probar Backend Localmente** ⏰ 5 min

```powershell
cd backend

# Configurar variables de entorno (PowerShell)
$env:DB_HOST="centerbeam.proxy.rlwy.net"
$env:DB_PORT="44269"
$env:DB_NAME="railway"
$env:DB_USER="root"
$env:DB_PASSWORD="tu_password_railway"
$env:JWT_KEY="CambiaEstaPorUnaClaveSecretaLargaYSegura123456789"

# Ejecutar
dotnet run
```

**✅ Verifica:**
- Abre http://localhost:10000
- Debería mostrar Swagger UI
- Prueba el endpoint `GET /api/Usuarios` (sin autenticación debería dar 401)

---

### **Paso 4: Probar Frontend Localmente** ⏰ 5 min

```bash
cd webapp

# Crear .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:10000/api" > .env.local
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ" >> .env.local

# Instalar y ejecutar
npm install
npm run dev
```

**✅ Verifica:**
- Abre http://localhost:3000
- Debería mostrar la página de login
- Intenta hacer login (si hay usuarios) o registrar uno nuevo

---

### **Paso 5: Crear Usuario Admin Inicial** ⏰ 5 min

**Opción A: Desde Swagger UI**

1. Ve a http://localhost:10000
2. Busca `POST /api/Usuarios/register`
3. Ejecuta con:

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

**Opción B: Desde Frontend**

1. Ve a http://localhost:3000
2. Si no hay usuarios, el sistema te redirigirá a crear uno
3. Crea el usuario con los datos anteriores

**✅ Verifica:**
- Intenta hacer login con `admin` / `Admin123!`
- Deberías ver el panel de administración

---

### **Paso 6: Deploy Backend a Railway** ⏰ 10 min

1. **Crear nuevo servicio en Railway:**
   - Ve a tu proyecto en Railway
   - Click "New Service" → "GitHub Repo"
   - Selecciona tu repositorio

2. **Configurar Root Directory:**
   - Settings → Root Directory: `backend`

3. **Agregar variables de entorno:**
   
   Ve a Settings → Variables y agrega:

   ```env
   DB_HOST=centerbeam.proxy.rlwy.net
   DB_PORT=44269
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=tu_password_railway
   JWT_KEY=CambiaEstaPorUnaClaveSecretaMuySegura123456789ABC
   JWT_ISSUER=AutoRefAPI
   JWT_AUDIENCE=AutoRefClient
   CLOUDINARY_CLOUD_NAME=dloufdonh
   CLOUDINARY_API_KEY=163115428918676
   CLOUDINARY_API_SECRET=DunTkc3_BTRzq65wvhHizu1i4RQ
   GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=autorefasturias@gmail.com
   SMTP_PASSWORD=parmqbpwxhjykkww
   PORT=10000
   ASPNETCORE_ENVIRONMENT=Production
   FRONTEND_URL=http://localhost:3000
   ```

4. **Deploy:**
   - Railway hará el deploy automáticamente
   - Anota la URL: `https://tu-backend.railway.app`

**✅ Verifica:**
- Abre `https://tu-backend.railway.app` → debería mostrar Swagger
- Prueba un endpoint

---

### **Paso 7: Deploy Frontend a Vercel** ⏰ 10 min

1. **Conectar repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - "Add New Project" → Importa tu repositorio

2. **Configurar:**
   - Framework: Next.js
   - Root Directory: `webapp`
   - Build Command: `npm run build`

3. **Agregar variables de entorno:**

   ```env
   NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
   ```

4. **Deploy:**
   - Click "Deploy"
   - Anota la URL: `https://tu-frontend.vercel.app`

**✅ Verifica:**
- Abre `https://tu-frontend.vercel.app`
- Debería cargar el login
- Intenta hacer login

---

### **Paso 8: Actualizar CORS en Backend** ⏰ 3 min

1. Ve a Railway → Backend Service → Variables
2. Actualiza `FRONTEND_URL`:

   ```env
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

3. Re-deploya el backend (Railway lo hará automáticamente)

**✅ Verifica:**
- Vuelve al frontend
- Prueba login
- Verifica que no hay errores de CORS en DevTools (F12)

---

## 🎉 ¡Todo Listo!

Tu sistema AutoRef está completamente desplegado y funcionando.

### **URLs Finales:**

- 🌐 **Frontend:** https://tu-frontend.vercel.app
- 🔧 **Backend API:** https://tu-backend.railway.app
- 📊 **Swagger:** https://tu-backend.railway.app
- 🗄️ **Base de Datos:** centerbeam.proxy.rlwy.net:44269

---

## 📚 Documentación de Referencia

- **Setup completo desde cero:** `SETUP_INICIAL.md`
- **Guía de deployment backend:** `backend/DEPLOYMENT_GUIDE.md`
- **Guía de deployment frontend:** `webapp/DEPLOYMENT_GUIDE.md`
- **Resumen de cambios técnicos:** `CAMBIOS_DEPLOYMENT.md`
- **README general:** `README.md`

---

## 🐛 Si algo falla...

### **Backend no arranca:**
```bash
# Verifica logs en Railway
Railway Dashboard → Service → Logs

# Common issue: DB_PASSWORD incorrecta
```

### **Frontend no conecta:**
```bash
# Verifica en DevTools (F12) → Network
# Si ves error CORS: actualiza FRONTEND_URL en Railway
# Si ves 404: verifica NEXT_PUBLIC_API_URL
```

### **Google Maps no carga:**
```bash
# 1. Verifica la API Key en Google Cloud Console
# 2. Habilita: Maps JavaScript API + Geocoding API
# 3. Agrega restricciones de dominio
```

---

## ⏭️ Después del Deployment

1. **Crear datos iniciales:**
   - Categorías de partidos
   - Equipos
   - Polideportivos
   - Clubes

2. **Invitar árbitros:**
   - Crear usuarios árbitros
   - Configurar sus perfiles

3. **Configurar notificaciones:**
   - Verificar que los emails lleguen
   - Ajustar plantillas si es necesario

4. **Monitoreo:**
   - Configurar alertas en Railway/Vercel
   - Revisar logs periódicamente

---

## 🔐 Seguridad Post-Deployment

- [ ] Cambiar `JWT_KEY` por una única y segura
- [ ] Rotar API Keys si fueron expuestas
- [ ] Configurar backup de base de datos
- [ ] Habilitar HTTPS (Vercel/Railway lo hacen automáticamente)
- [ ] Revisar que `.env` esté en `.gitignore`

---

## 📞 ¿Necesitas Ayuda?

1. **Revisa la documentación:** Todos los `.md` tienen troubleshooting
2. **Verifica logs:** Railway y Vercel tienen logs en tiempo real
3. **Usa DevTools:** F12 en el navegador para ver errores

---

**¡Éxito con tu deployment! 🚀⚽**

---

*Tiempo total estimado: 1 hora*
*Dificultad: Media*

