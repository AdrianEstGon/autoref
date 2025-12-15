# 🚀 Guía de Deployment - Frontend AutoRef

## 📋 Pre-requisitos

- Node.js 18+ instalado
- Backend desplegado y funcionando
- Variables de entorno configuradas

---

## 🔧 Configuración de Variables de Entorno

### **1. Crear archivo `.env.local` (desarrollo)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:10000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
```

### **2. Configurar para producción**

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
```

---

## 💻 Desarrollo Local

### **1. Instalar Dependencias**

```bash
npm install
```

### **2. Ejecutar en Modo Desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### **3. Build Local (Testing)**

```bash
npm run build
npm start
```

---

## ☁️ Deployment en Vercel (Recomendado)

Vercel es la plataforma ideal para Next.js.

### **1. Instalar Vercel CLI (opcional)**

```bash
npm install -g vercel
```

### **2. Deploy desde GitHub**

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Import Project"
3. Conecta tu repositorio de GitHub
4. Selecciona la carpeta `webapp` como directorio raíz
5. Configura las variables de entorno:

```
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
```

6. Click en "Deploy"

### **3. Deploy desde CLI**

```bash
cd webapp
vercel

# Para producción
vercel --prod
```

### **4. Configurar Variables de Entorno en Vercel**

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Ingresa: https://tu-backend.railway.app/api

vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production
# Ingresa: AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
```

---

## 🐳 Deployment con Docker

### **1. Actualizar Dockerfile (si es necesario)**

El `Dockerfile` actual está listo para producción.

### **2. Build de la Imagen**

```bash
docker build -t autoref-frontend .
```

### **3. Run Local (Testing)**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:10000/api \
  -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ \
  autoref-frontend
```

### **4. Deploy a Docker Registry**

```bash
# Tag
docker tag autoref-frontend tu-usuario/autoref-frontend:latest

# Push
docker push tu-usuario/autoref-frontend:latest
```

---

## 🌐 Deployment en Netlify

### **1. Configurar Build Settings**

En `netlify.toml` (crear si no existe):

```toml
[build]
  base = "webapp/"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### **2. Deploy desde GitHub**

1. Ve a [netlify.com](https://netlify.com)
2. Click en "Add new site" → "Import an existing project"
3. Conecta tu repositorio
4. Configura:
   - **Base directory:** `webapp`
   - **Build command:** `npm run build`
   - **Publish directory:** `webapp/.next`

5. Agregar variables de entorno:

```
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
```

### **3. Deploy desde CLI**

```bash
npm install -g netlify-cli
cd webapp
netlify deploy --prod
```

---

## ☁️ Deployment en Railway

### **1. Crear Nuevo Servicio**

1. En Railway Dashboard, click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige tu repositorio

### **2. Configurar Root Directory**

En Railway settings:
- **Root Directory:** `webapp`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

### **3. Configurar Variables de Entorno**

```
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ
PORT=3000
```

---

## 🌍 Deployment en Azure Static Web Apps

### **1. Configurar `staticwebapp.config.json`**

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["anonymous"]
    }
  ]
}
```

### **2. Deploy desde Azure Portal**

1. Crear nuevo recurso "Static Web App"
2. Conectar repositorio GitHub
3. Configurar:
   - **App location:** `/webapp`
   - **Output location:** `.next`

---

## 📦 Build para Producción (Static Export)

Si prefieres un build estático (sin servidor Node.js):

### **1. Actualizar `next.config.ts`**

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### **2. Build**

```bash
npm run build
```

El output estará en `out/` y puede servirse con cualquier hosting estático (S3, Cloudflare Pages, etc.)

---

## 🔄 Actualizar Backend URL después del Deployment

### **Escenario:** Backend ya está desplegado en Railway

1. Obtén la URL del backend: `https://tu-backend.railway.app`

2. Actualiza en Vercel/Netlify:

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_API_URL production
# Ingresa: https://tu-backend.railway.app/api
```

**Netlify:**
- Ve a Site settings → Environment variables
- Edita `NEXT_PUBLIC_API_URL` → `https://tu-backend.railway.app/api`

3. Re-deploy:

```bash
vercel --prod  # Vercel
netlify deploy --prod  # Netlify
```

---

## 🔐 Configurar CORS en el Backend

⚠️ **IMPORTANTE:** Después de desplegar el frontend, actualiza el backend con la URL del frontend.

En Railway (backend), agrega:

```
FRONTEND_URL=https://tu-frontend.vercel.app
ADDITIONAL_CORS_ORIGIN=https://tu-frontend-adicional.netlify.app
```

---

## ✅ Verificación Post-Deployment

### **1. Verificar Conexión al Backend**

Abre DevTools (F12) → Console y verifica que las llamadas a la API funcionan:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### **2. Test de Login**

1. Ve a la página de login
2. Intenta iniciar sesión
3. Verifica en DevTools → Network que las llamadas a `/api/Usuarios/login` funcionen

### **3. Test de Google Maps**

1. Ve a la página de creación de usuarios
2. Verifica que el mapa de Google se cargue correctamente

---

## 🐛 Troubleshooting

### **Error: "Failed to fetch" o CORS**

- Verifica que `NEXT_PUBLIC_API_URL` esté correctamente configurado
- Verifica que el backend tenga `FRONTEND_URL` configurado
- Asegúrate de que ambos usen HTTPS en producción

### **Error: Google Maps no carga**

- Verifica que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté configurado
- Verifica que la API Key tenga permisos para el dominio de producción

### **Error: Variables de entorno no se aplican**

- Las variables `NEXT_PUBLIC_*` deben configurarse **antes** del build
- Después de cambiar variables, haz un nuevo deploy

### **Error: Página 404 al recargar**

- Verifica que el hosting soporte SPA routing
- En Vercel/Netlify esto se maneja automáticamente
- En Nginx/Apache, configura rewrites

---

## 🔄 CI/CD Automático

### **GitHub Actions + Vercel**

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'webapp/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./webapp
```

---

## 📊 Monitoreo

### **Vercel Analytics (Gratis)**

En tu dashboard de Vercel, ve a "Analytics" para ver:
- Visitas
- Rendimiento
- Errores

### **Google Analytics**

Agrega en `webapp/src/app/layout.tsx`:

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID`}
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🚀 Optimización de Performance

### **1. Lazy Loading de Componentes**

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Cargando...</p>,
});
```

### **2. Image Optimization**

Usa `next/image` en lugar de `<img>`:

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### **3. Code Splitting**

Next.js lo hace automáticamente, pero puedes optimizar más:

```typescript
// Solo importa lo necesario
import { Button } from '@mui/material';
// En vez de:
// import * from '@mui/material';
```

---

## 📝 Checklist de Deployment

- [ ] Backend desplegado y funcionando
- [ ] Variables de entorno configuradas
- [ ] `NEXT_PUBLIC_API_URL` apunta al backend correcto
- [ ] CORS configurado en el backend
- [ ] Google Maps API Key configurada
- [ ] Build exitoso (`npm run build`)
- [ ] Login funciona
- [ ] Navegación funciona
- [ ] Mapas se cargan
- [ ] Imágenes se cargan (Cloudinary)
- [ ] HTTPS habilitado
- [ ] Dominio personalizado configurado (opcional)

---

**¡Frontend listo para producción! 🎉**

### **URLs de Ejemplo:**

- **Backend:** https://autoref-backend.railway.app
- **Frontend:** https://autoref-frontend.vercel.app
- **Swagger:** https://autoref-backend.railway.app

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel/Netlify
2. Verifica las variables de entorno
3. Comprueba la conexión al backend
4. Revisa DevTools → Console para errores

