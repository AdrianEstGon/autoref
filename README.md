# ⚽ AutoRef - Sistema de Gestión de Árbitros Deportivos

Sistema completo de gestión de árbitros, partidos y designaciones para asociaciones deportivas.

---

## 📁 Estructura del Proyecto

```
autoref/
├── backend/                # API .NET 8.0
│   ├── Controllers/        # Endpoints de la API
│   ├── Database/           # Modelos de Entity Framework
│   ├── Migrations/         # Migraciones de base de datos
│   ├── Services/           # Servicios (Email, etc.)
│   ├── Dockerfile          # Dockerfile para deployment
│   ├── apply-migrations.ps1 # Script para aplicar migraciones
│   ├── env.example         # Variables de entorno de ejemplo
│   └── DEPLOYMENT_GUIDE.md # Guía de deployment del backend
│
├── webapp/                 # Frontend Next.js + React + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes de React
│   │   │   ├── hooks/      # Custom hooks
│   │   │   ├── services/   # Servicios de API (Axios)
│   │   │   ├── theme/      # Tema de Material-UI
│   │   │   ├── types/      # Interfaces de TypeScript
│   │   │   └── utils/      # Utilidades
│   │   ├── config.ts       # Configuración de API URL
│   │   └── tests/          # Tests de integración
│   ├── Dockerfile          # Dockerfile para deployment
│   ├── env.example         # Variables de entorno de ejemplo
│   └── DEPLOYMENT_GUIDE.md # Guía de deployment del frontend
│
└── README.md               # Este archivo
```

---

## 🚀 Quick Start

### **Prerrequisitos**

- .NET 8.0 SDK
- Node.js 18+
- Base de datos SQL Server (Railway, Azure, etc.)
- Cuenta de Cloudinary (para almacenamiento de imágenes)
- Google Maps API Key

---

## 🔧 Configuración Inicial

### **1. Backend (.NET)**

```bash
# Navegar al directorio del backend
cd backend

# Copiar archivo de ejemplo de variables de entorno
Copy-Item env.example .env

# Editar .env con tus credenciales
# - DB_PASSWORD: Password de Railway
# - JWT_KEY: Clave secreta para JWT
# - Cloudinary credentials
# - Google Maps API Key

# Restaurar dependencias
dotnet restore

# Aplicar migraciones (ver backend/DEPLOYMENT_GUIDE.md)
./apply-migrations.ps1

# Ejecutar
dotnet run
```

Backend disponible en: `http://localhost:10000`  
Swagger UI: `http://localhost:10000`

### **2. Frontend (Next.js)**

```bash
# Navegar al directorio del frontend
cd webapp

# Copiar archivo de ejemplo de variables de entorno
cp env.example .env.local

# Editar .env.local
# NEXT_PUBLIC_API_URL=http://localhost:10000/api

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Frontend disponible en: `http://localhost:3000`

---

## 📦 Deployment

### **Backend → Railway**

1. **Crear servicio en Railway**
2. **Configurar variables de entorno** (ver `backend/env.example`)
3. **Deploy automático** desde GitHub

📘 **Guía completa:** `backend/DEPLOYMENT_GUIDE.md`

### **Frontend → Vercel**

1. **Conectar repositorio en Vercel**
2. **Configurar root directory:** `webapp`
3. **Agregar variables de entorno:**
   - `NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_key`
4. **Deploy automático**

📘 **Guía completa:** `webapp/DEPLOYMENT_GUIDE.md`

---

## 🏗️ Tecnologías

### **Backend**
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server (Railway)
- Cloudinary (almacenamiento de imágenes)
- MailKit (envío de emails)
- JWT Authentication

### **Frontend**
- Next.js 14
- React 18
- TypeScript
- Material-UI (MUI)
- Axios
- Google Maps API
- React Testing Library + Jest

---

## 🔐 Credenciales y Seguridad

### **Variables de Entorno Críticas**

#### Backend:
```bash
DB_PASSWORD=          # ⚠️ NUNCA commitear
JWT_KEY=              # ⚠️ Cambiar en producción
CLOUDINARY_API_SECRET= # ⚠️ Mantener secreto
SMTP_PASSWORD=        # ⚠️ Mantener secreto
```

#### Frontend:
```bash
NEXT_PUBLIC_API_URL=  # URL del backend desplegado
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY= # Restringir por dominio
```

---

## 🧪 Testing

### **Frontend**

```bash
cd webapp

# Ejecutar todos los tests
npm test

# Ejecutar con coverage
npm test -- --coverage

# Ejecutar test específico
npm test -- CU1_IniciarSesion.test.tsx
```

---

## 📊 Base de Datos

### **Conexión Railway**

```
Server: centerbeam.proxy.rlwy.net
Port: 44269
Database: railway
User: root
Password: [Configurar en variables de entorno]
```

### **Tablas Principales**

- `Usuarios` - Árbitros y administradores
- `Partidos` - Partidos a asignar
- `Disponibilidades` - Disponibilidad de árbitros
- `Categorias` - Categorías de partidos
- `Equipos` - Equipos participantes
- `Clubs` - Clubes (para evitar conflictos de interés)
- `Polideportivos` - Ubicaciones de partidos
- `Notificaciones` - Sistema de notificaciones

### **Aplicar Migraciones**

```bash
cd backend
./apply-migrations.ps1
```

---

## 🌟 Funcionalidades Principales

### **Gestión de Usuarios**
- ✅ Registro y autenticación con JWT
- ✅ Perfiles de árbitros con niveles y licencias
- ✅ Foto de perfil (Cloudinary)
- ✅ Geolocalización automática (Google Maps)
- ✅ Vinculación a clubs

### **Gestión de Partidos**
- ✅ CRUD completo de partidos
- ✅ Importación desde Excel
- ✅ Filtros y búsqueda avanzada
- ✅ Visualización en mapa (Google Maps)

### **Designaciones**
- ✅ Asignación manual de árbitros
- ✅ **Asignación automática con algoritmo optimizado (A* + Beam Search)**
- ✅ Criterios: disponibilidad, distancia, nivel, club vinculado
- ✅ Publicación y notificaciones
- ✅ Confirmación de partidos

### **Disponibilidad**
- ✅ Calendario visual
- ✅ Gestión de franjas horarias
- ✅ Vista mensual

### **Notificaciones**
- ✅ Sistema de notificaciones en tiempo real
- ✅ Notificaciones por email

---

## 🎨 UI/UX Moderna

- ✅ Tema personalizado con Material-UI
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones y transiciones suaves
- ✅ Glassmorphism y gradientes modernos
- ✅ Dark mode ready (preparado para implementar)

---

## 🔄 CI/CD

### **Configuración Recomendada**

#### GitHub Actions (Backend)

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['backend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
```

#### GitHub Actions (Frontend)

```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths: ['webapp/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

---

## 📈 Performance

### **Backend**
- ✅ Paginación en endpoints
- ✅ Índices de base de datos
- ✅ Caching en algoritmo de designaciones
- ✅ Beam Search para optimización

### **Frontend**
- ✅ Code splitting automático (Next.js)
- ✅ Lazy loading de componentes
- ✅ Memoización con `useCallback` y `useMemo`
- ✅ Optimización de re-renders con `React.memo`
- ✅ Custom hooks reutilizables

---

## 🐛 Troubleshooting

### **Error: No se puede conectar al backend**
1. Verifica que el backend esté corriendo
2. Verifica `NEXT_PUBLIC_API_URL` en el frontend
3. Revisa CORS en el backend

### **Error: Migraciones fallan**
1. Verifica credenciales de Railway
2. Asegúrate de que `TrustServerCertificate=True` esté en el connection string
3. Ejecuta `dotnet ef database update` manualmente

### **Error: Google Maps no carga**
1. Verifica que la API Key esté configurada
2. Habilita "Maps JavaScript API" y "Geocoding API" en Google Cloud Console
3. Configura restricciones de dominio

---

## 📞 Soporte y Contacto

- **Documentación Backend:** `backend/DEPLOYMENT_GUIDE.md`
- **Documentación Frontend:** `webapp/DEPLOYMENT_GUIDE.md`
- **Logs Railway:** Dashboard → Service → Logs
- **Logs Vercel:** Dashboard → Project → Deployments → Logs

---

## 📝 TODO / Roadmap

- [ ] Implementar dark mode completo
- [ ] Sistema de reportes y estadísticas
- [ ] Exportación de designaciones a PDF
- [ ] App móvil (React Native)
- [ ] Integración con calendarios (Google Calendar, iCal)
- [ ] Sistema de chat entre árbitros y admin
- [ ] Historial de cambios (audit log)

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 🎯 Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│   Backend API   │
│   (.NET 8.0)    │
│   Port: 10000   │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌──────────────────┐
│   SQL Server    │   │   Cloudinary     │
│   (Railway)     │   │   (Imágenes)     │
│   Port: 44269   │   │                  │
└─────────────────┘   └──────────────────┘
```

---

## 🌐 URLs de Producción (Ejemplo)

- **Frontend:** https://autoref.vercel.app
- **Backend:** https://autoref-backend.railway.app
- **Swagger:** https://autoref-backend.railway.app
- **Base de Datos:** centerbeam.proxy.rlwy.net:44269

---

**¡Sistema completo listo para producción! ⚽🏆**

---

## 📚 Documentación Adicional

- [Backend Deployment Guide](./backend/DEPLOYMENT_GUIDE.md)
- [Frontend Deployment Guide](./webapp/DEPLOYMENT_GUIDE.md)
- [Modernización UI](./webapp/MODERNIZACION_COMPLETA.md)
- [Optimizaciones Frontend](./webapp/MODERNIZACION_UI.md)

