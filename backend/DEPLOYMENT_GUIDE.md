# 🚀 Guía de Deployment - Backend AutoRef

## 📋 Pre-requisitos

- .NET 8.0 SDK instalado
- Acceso a la base de datos Railway
- Variables de entorno configuradas

---

## 🗄️ Configuración de Base de Datos Railway

### **1. Obtener Credenciales de Railway**

En tu panel de Railway, obtén:
- **Host:** `centerbeam.proxy.rlwy.net`
- **Port:** `44269`
- **Database:** `railway`
- **Username:** `root`
- **Password:** [Tu password de Railway]

### **2. Configurar Variables de Entorno**

Copia `env.example` a `.env` y configura:

```bash
DB_HOST=centerbeam.proxy.rlwy.net
DB_PORT=44269
DB_NAME=railway
DB_USER=root
DB_PASSWORD=tu_password_real
```

---

## 🔄 Generar y Aplicar Migraciones

### **Opción 1: Aplicar Migraciones Existentes**

Si ya tienes migraciones (carpeta `Migrations/`):

```bash
# Configurar connection string temporal
$env:DB_CONNECTION_STRING="Server=centerbeam.proxy.rlwy.net,44269;Database=railway;User Id=root;Password=TU_PASSWORD;TrustServerCertificate=True;Encrypt=False;"

# Aplicar migraciones
dotnet ef database update
```

### **Opción 2: Crear Migraciones Desde Cero**

Si necesitas regenerar las migraciones:

```bash
# 1. Eliminar carpeta Migrations (si existe)
Remove-Item -Path Migrations -Recurse -Force

# 2. Crear migración inicial
dotnet ef migrations add InitialCreate

# 3. Aplicar a la base de datos
dotnet ef database update
```

### **Verificar Tablas Creadas**

Conéctate a Railway y verifica que se crearon:
- `Usuarios`
- `Partidos`
- `Disponibilidades`
- `Categorias`
- `Equipos`
- `Clubs`
- `Polideportivos`
- `Notificaciones`
- Tablas de AspNetCore Identity

---

## 🐳 Deployment con Docker

### **1. Build de la Imagen**

```bash
docker build -t autoref-backend .
```

### **2. Run Local (Testing)**

```bash
docker run -p 10000:10000 \
  -e DB_HOST=centerbeam.proxy.rlwy.net \
  -e DB_PORT=44269 \
  -e DB_NAME=railway \
  -e DB_USER=root \
  -e DB_PASSWORD=tu_password \
  -e JWT_KEY=TuClaveSecretaQueEsLoSuficientementeLargaParaCumplirConLosRequisitosDeHS256 \
  -e CLOUDINARY_CLOUD_NAME=dloufdonh \
  -e CLOUDINARY_API_KEY=163115428918676 \
  -e CLOUDINARY_API_SECRET=DunTkc3_BTRzq65wvhHizu1i4RQ \
  -e FRONTEND_URL=http://localhost:3000 \
  autoref-backend
```

---

## ☁️ Deployment en Railway

### **1. Crear Nuevo Servicio en Railway**

1. Ve a Railway Dashboard
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo" o "Empty Project"

### **2. Configurar Variables de Entorno en Railway**

En el panel de Railway, agrega:

```
DB_HOST=centerbeam.proxy.rlwy.net
DB_PORT=44269
DB_NAME=railway
DB_USER=root
DB_PASSWORD=[tu_password]
JWT_KEY=TuClaveSecretaQueEsLoSuficientementeLargaParaCumplirConLosRequisitosDeHS256
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
FRONTEND_URL=https://tu-frontend.vercel.app
```

### **3. Deploy**

Railway detectará automáticamente el `Dockerfile` y hará el build.

---

## 🌐 Deployment en Render / Otras Plataformas

### **Render.com**

1. Crear nuevo "Web Service"
2. Conectar repositorio
3. Configurar:
   - **Build Command:** `docker build -t autoref-backend .`
   - **Start Command:** `docker run autoref-backend`
   - **Docker:** Yes

4. Agregar las mismas variables de entorno

### **Azure App Service**

```bash
az webapp create --resource-group myResourceGroup \
  --plan myAppServicePlan --name autoref-backend \
  --deployment-container-image autoref-backend:latest
```

---

## 🔧 Desarrollo Local

### **1. Restaurar Dependencias**

```bash
dotnet restore
```

### **2. Configurar Variables de Entorno**

```powershell
$env:DB_HOST="centerbeam.proxy.rlwy.net"
$env:DB_PORT="44269"
$env:DB_NAME="railway"
$env:DB_USER="root"
$env:DB_PASSWORD="tu_password"
$env:JWT_KEY="TuClaveSecretaQueEsLoSuficientementeLargaParaCumplirConLosRequisitosDeHS256"
```

### **3. Ejecutar**

```bash
dotnet run
```

La API estará disponible en: `http://localhost:10000`
Swagger UI: `http://localhost:10000`

---

## 📝 Endpoints Principales

- **Swagger:** `http://localhost:10000`
- **Health Check:** `GET /api/Usuarios` (con token)
- **Login:** `POST /api/Usuarios/login`

---

## ✅ Verificación Post-Deployment

1. **Verificar que la API responde:**
   ```bash
   curl https://tu-backend-url.railway.app/api/Usuarios
   ```

2. **Verificar Swagger:**
   ```
   https://tu-backend-url.railway.app
   ```

3. **Test de Login:**
   ```bash
   curl -X POST https://tu-backend-url.railway.app/api/Usuarios/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123!"}'
   ```

---

## 🐛 Troubleshooting

### **Error: No se puede conectar a la base de datos**
- Verifica las credenciales de Railway
- Asegúrate de que `TrustServerCertificate=True` esté en el connection string
- Verifica que el puerto 44269 sea accesible

### **Error: JWT Key no configurada**
- Verifica que la variable `JWT_KEY` esté configurada
- Debe tener al menos 32 caracteres

### **Error: CORS**
- Actualiza `FRONTEND_URL` con la URL real de tu frontend
- Agrega `ADDITIONAL_CORS_ORIGIN` si tienes múltiples frontends

---

## 📦 Actualizar Backend Desplegado

### **Railway (Auto-deploy desde GitHub)**

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway hará auto-deploy automáticamente.

### **Manual**

```bash
# 1. Build nueva imagen
docker build -t autoref-backend:v2 .

# 2. Push al registry
docker push autoref-backend:v2

# 3. Actualizar servicio
railway up
```

---

## 🔐 Seguridad

- ✅ Todas las credenciales están en variables de entorno
- ✅ HTTPS recomendado en producción
- ✅ CORS configurado para orígenes específicos
- ✅ JWT con firma segura
- ⚠️ Cambia las API keys de producción (Cloudinary, Google Maps)
- ⚠️ Usa contraseñas fuertes para SMTP

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Railway/Render
2. Verifica las variables de entorno
3. Comprueba la conexión a la base de datos
4. Revisa los logs de la aplicación

---

**¡Backend listo para producción! 🎉**

