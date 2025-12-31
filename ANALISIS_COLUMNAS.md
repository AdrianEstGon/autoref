# ANÁLISIS DE COLUMNAS DE BASE DE DATOS vs REQUISITOS FUNCIONALES

## Leyenda
- ✅ **NECESARIA**: Columna esencial para los requisitos
- ⚠️ **DUDOSA**: Puede ser útil pero no es crítica
- ❌ **INNECESARIA**: No aporta valor a los requisitos actuales
- 🔄 **HEREDADA**: Columna del sistema anterior (Rails/legacy)

---

## 1. CAMPOS_DE_JUEGO (12 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador único |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete - puede ser útil para histórico |
| Nombre | text | ✅ NECESARIA | Identificación del polideportivo (5.4) |
| Clubes | text | ⚠️ DUDOSA | Relación club-pista, mejor normalizar |
| Servicios | text | ❌ INNECESARIA | No mencionado en requisitos |
| Zona | text | ⚠️ DUDOSA | Útil para designaciones por zona (5.5) |
| Dirección | text | ✅ NECESARIA | Localización física (5.4) |
| Población | text | ✅ NECESARIA | Localización física (5.4) |
| lat | double | ✅ NECESARIA | Cálculo distancias para árbitros (5.5, 5.8) |
| lng | double | ✅ NECESARIA | Cálculo distancias para árbitros (5.5, 5.8) |
| search_text_cache | text | 🔄 HEREDADA | Cache de búsqueda - optimización |

**Resumen**: 7 necesarias, 3 dudosas, 1 innecesaria, 1 heredada

---

## 2. CATEGORIAS (20 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador único |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete |
| Posición | bigint | ⚠️ DUDOSA | Orden visual en UI |
| Nombre | text | ✅ NECESARIA | "Senior", "Junior", etc. (5.3) |
| Token | text | 🔄 HEREDADA | Identificador legacy |
| Descripción | text | ❌ INNECESARIA | No mencionado |
| born_from | datetime | ✅ NECESARIA | Rango edad categoría (5.1, 5.7) |
| born_to | datetime | ✅ NECESARIA | Rango edad categoría (5.1, 5.7) |
| Masculino: Dimensiones pista | text | ❌ INNECESARIA | Detalles técnicos no en requisitos |
| Masculino: Dimensiones playa | text | ❌ INNECESARIA | Detalles técnicos no en requisitos |
| Femenino: Dimensiones pista | text | ❌ INNECESARIA | Detalles técnicos no en requisitos |
| Femenino: Dimensiones playa | text | ❌ INNECESARIA | Detalles técnicos no en requisitos |
| Color | text | ⚠️ DUDOSA | UI/UX - identificación visual |
| Nombre playa | text | ❌ INNECESARIA | Modalidad específica no en requisitos |
| Edad inicio | bigint | ✅ NECESARIA | Control edad jugadores (5.1) |
| Nº años | bigint | ✅ NECESARIA | Control edad jugadores (5.1) |
| Federado | tinyint | ✅ NECESARIA | Distinción federado/no federado (5.7) |
| Categorías que pueden jugar en esta | text | ✅ NECESARIA | Habilitaciones superiores (5.1) |
| search_text_cache | text | 🔄 HEREDADA | Cache búsqueda |

**Resumen**: 9 necesarias, 3 dudosas, 6 innecesarias, 2 heredadas

---

## 3. CLUBS (11 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador único |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete |
| Nombre | text | ✅ NECESARIA | Identificación club (5.2) |
| Teléfono | text | ✅ NECESARIA | Contacto (5.2) |
| Correo electrónico | text | ✅ NECESARIA | Contacto y notificaciones (5.2, 5.10) |
| Escudo | text | ⚠️ DUDOSA | UI/visual - no crítico |
| client_id | text | 🔄 HEREDADA | Sistema legacy |
| Administración asociada | text | ❌ INNECESARIA | No en requisitos |
| app_user_id | text | 🔄 HEREDADA | Relación usuario - mejor normalizar |
| search_text_cache | text | 🔄 HEREDADA | Cache búsqueda |

**Resumen**: 5 necesarias, 2 dudosas, 1 innecesaria, 3 heredadas

**FALTA**: Datos fiscales (CIF, dirección fiscal, razón social) mencionados en 5.2

---

## 4. COMPETICIONES (30 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador único |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete |
| Posición | bigint | ⚠️ DUDOSA | Orden visual |
| age_category_id | text | 🔄 HEREDADA | Mejor normalizar FK |
| Nombre | text | ✅ NECESARIA | Identificación competición (5.3) |
| competition_group_id | text | 🔄 HEREDADA | Agrupación competiciones |
| Tipo de competición | text | ✅ NECESARIA | Liga/Copa/Torneo (5.3) |
| Modalidad | text | ✅ NECESARIA | Pista/Playa si aplica (5.3) |
| sex | text | ✅ NECESARIA | Masculino/Femenino/Mixto (5.3) |
| Mínimo jugadores por equipo | bigint | ✅ NECESARIA | Validación plantillas (5.2) |
| Máximo jugadores por equipo | bigint | ✅ NECESARIA | Validación plantillas (5.2) |
| Control de jugadores | text | ❌ INNECESARIA | Detalle técnico |
| Sets | text | ⚠️ DUDOSA | Configuración deporte - puede ser útil |
| set_points | text | ⚠️ DUDOSA | Configuración deporte |
| Resolución empate | text | ⚠️ DUDOSA | Reglas desempate (5.3) |
| Puntuación clasificación | text | ⚠️ DUDOSA | Reglas puntos (5.3) |
| Número de jugadores en pista | bigint | ❌ INNECESARIA | Detalle técnico |
| change_points | text | ❌ INNECESARIA | Detalle técnico |
| Configuración sets | text | ❌ INNECESARIA | Detalle técnico |
| ¿Hay líbero? | tinyint | ❌ INNECESARIA | Detalle técnico voleibol |
| Mixto? | tinyint | ✅ NECESARIA | Tipo competición (5.3) |
| Precios | text | ✅ NECESARIA | Cuotas inscripción (5.3) |
| Puntuación playa | text | ❌ INNECESARIA | Modalidad específica |
| Criterios clasificación | text | ⚠️ DUDOSA | Reglas desempate (5.3) |
| Mínimo staff por equipo | bigint | ⚠️ DUDOSA | Control plantilla técnica |
| Máximo staff por equipo | bigint | ⚠️ DUDOSA | Control plantilla técnica |
| Visible club | tinyint | ⚠️ DUDOSA | Control acceso |
| Visible web | tinyint | ✅ NECESARIA | Portal público (5.9) |
| search_text_cache | text | 🔄 HEREDADA | Cache búsqueda |

**Resumen**: 11 necesarias, 11 dudosas, 7 innecesarias, 1 heredada

---

## 5. CURSOS (14 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| **TODAS** | - | ❌ INNECESARIA | **TABLA COMPLETA NO EN REQUISITOS** |

**Resumen**: La funcionalidad de cursos no está en los requisitos actuales. Podría eliminarse la tabla completa.

---

## 6. DESIGNACIONES (23 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador único |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete |
| Árbitro | text | ✅ NECESARIA | Relación persona (5.5) |
| Desde | datetime | ❌ INNECESARIA | Duplicado con Día |
| Hasta | datetime | ❌ INNECESARIA | Duplicado con Día |
| Día | datetime | ✅ NECESARIA | Fecha partido (5.5) |
| Estado | text | ✅ NECESARIA | Pendiente/Aceptada/Rechazada (5.5) |
| Partidos | text | 🔄 HEREDADA | Debería ser FK normalizada |
| Pista | text | ✅ NECESARIA | Lugar designación (5.5) |
| Motivo de rechazo | text | ✅ NECESARIA | Registro motivo rechazo (5.5) |
| Fecha designación | datetime | ✅ NECESARIA | Cuándo se asignó (5.5) |
| Fecha respuesta | datetime | ✅ NECESARIA | Cuándo aceptó/rechazó (5.5) |
| Árbitro nº | bigint | ⚠️ DUDOSA | Primer/segundo árbitro |
| Partido | text | ✅ NECESARIA | Relación partido (5.5) |
| Fecha de cancelación | datetime | ⚠️ DUDOSA | Histórico cancelaciones |
| court_lat | double | ✅ NECESARIA | Cálculo distancias (5.8) |
| court_lng | double | ✅ NECESARIA | Cálculo distancias (5.8) |
| referee_lat | double | ✅ NECESARIA | Cálculo distancias (5.8) |
| referee_lng | double | ✅ NECESARIA | Cálculo distancias (5.8) |
| Equipos | text | 🔄 HEREDADA | Denormalizado - info en partido |
| Clubes | text | 🔄 HEREDADA | Denormalizado - info en partido |
| search_text_cache | text | 🔄 HEREDADA | Cache búsqueda |

**Resumen**: 13 necesarias, 3 dudosas, 2 innecesarias, 5 heredadas

---

## 7. EDICIONES (51 columnas) ⚠️ **TABLA MUY COMPLEJA**

Esta tabla mezcla configuración de competición con ejecución. **Muchas columnas duplican COMPETICIONES**.

| Grupo | Evaluación | Razón |
|-------|------------|-------|
| Identificación (7 cols) | ✅ NECESARIAS | ID, nombre, temporada, competición |
| Configuración deporte (15 cols) | ❌ INNECESARIAS | Sets, puntos, líbero, etc. - ya en COMPETICIONES |
| Configuración arbitraje (10 cols) | ✅ NECESARIAS | Niveles, tarifas, obligatorios (5.5, 5.8) |
| Inscripciones (8 cols) | ✅ NECESARIAS | Fechas, precios, min/max jugadores (5.3) |
| Control (6 cols) | ⚠️ DUDOSAS | Bloqueado, visible, tareas |
| Denormalización (5 cols) | 🔄 HEREDADAS | Campos calculados/cache |

**Resumen**: Esta tabla necesita REFACTORIZACIÓN. Debería dividirse o simplificarse.

---

## 8. EQUIPOS (21 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador único |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete |
| Nombre | text | ✅ NECESARIA | Identificación equipo (5.2) |
| Club | text | ✅ NECESARIA | Relación club (5.2) |
| Edición | text | ✅ NECESARIA | Inscripción en competición (5.3) |
| Comentarios | text | ⚠️ DUDOSA | Notas internas |
| Campo de juego | text | ✅ NECESARIA | Pista como local (5.4) |
| Posición Ránking | text | ❌ INNECESARIA | No en requisitos |
| Estado | text | ✅ NECESARIA | Inscrito/Validado/Rechazado (5.3) |
| Inscripción de circuito completo | text | ❌ INNECESARIA | Concepto no explicado |
| Torneo | text | 🔄 HEREDADA | Relación ya en Edición |
| Categoria | text | 🔄 HEREDADA | Relación ya en Edición |
| Sexo | text | 🔄 HEREDADA | Dato ya en Edición |
| Inscrito por | text | ⚠️ DUDOSA | Trazabilidad usuario |
| Valor aleatorio para resolver empates | bigint | ❌ INNECESARIA | Técnico |
| Edición2 | text | ❌ INNECESARIA | Duplicado? |
| Puntos ránking | bigint | ❌ INNECESARIA | No en requisitos |
| Índice categoría | bigint | ❌ INNECESARIA | Técnico |
| search_text_cache | text | 🔄 HEREDADA | Cache búsqueda |
| player_data | text | 🔄 HEREDADA | Denormalizado |

**Resumen**: 8 necesarias, 3 dudosas, 5 innecesarias, 5 heredadas

---

## 9. FASESTORNEO (14 columnas)

Esta tabla gestiona fases de torneo (cuartos, semifinales, etc.).

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Edición | text | ✅ NECESARIA | Relación competición |
| Nº Fase | bigint | ✅ NECESARIA | Orden fases |
| Nombre | text | ✅ NECESARIA | "Cuartos", "Semifinales" |
| Torneo | text | 🔄 HEREDADA | Ya en Edición |
| Tipo de fase | text | ✅ NECESARIA | Eliminatoria/Grupos |
| Día | datetime | ✅ NECESARIA | Fecha de la fase |
| Hora de inicio | bigint | ⚠️ DUDOSA | Planificación |
| Hora objetivo de fin | bigint | ⚠️ DUDOSA | Planificación |
| Tamaño de pista | text | ❌ INNECESARIA | Técnico |
| Especificar num pista | text | ⚠️ DUDOSA | Asignación pistas |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 7 necesarias, 3 dudosas, 1 innecesaria, 3 heredadas

---

## 10. FECHAS (7 columnas) ⚠️ **TABLA POCO CLARA**

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ⚠️ DUDOSA | Propósito no claro |
| training_id | bigint | ❌ INNECESARIA | Entrenamientos no en requisitos |
| **Resto** | - | ❌ INNECESARIAS | Tabla de entrenamientos |

**Resumen**: Tabla probablemente innecesaria completa (entrenamientos no en requisitos).

---

## 11. GRUPOSEDICION (18 columnas)

Gestiona grupos dentro de una fase (Grupo A, Grupo B en liga).

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Fase edición | text | ✅ NECESARIA | Relación fase |
| Nombre | text | ✅ NECESARIA | "Grupo A", "Grupo B" |
| Tipo de competición | text | 🔄 HEREDADA | Ya en nivel superior |
| Asignación de equipos | text | ⚠️ DUDOSA | Equipos del grupo |
| Estado | text | ⚠️ DUDOSA | Control progreso |
| Fechas de juego | text | ⚠️ DUDOSA | Jornadas |
| clasification_criteria | text | 🔄 HEREDADA | Ya definido arriba |
| Nº pista | text | ⚠️ DUDOSA | Pista asignada |
| Campo de juego | text | ⚠️ DUDOSA | Lugar |
| Pago del arbitraje | text | 🔄 HEREDADA | Ya en nivel superior |
| Pagador fijo | text | 🔄 HEREDADA | Ya en nivel superior |
| Edición | text | ✅ NECESARIA | Relación competición |
| Caché clasificación | text | 🔄 HEREDADA | Optimización |
| Caché HTML clasificación | text | 🔄 HEREDADA | Optimización |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 4 necesarias, 5 dudosas, 0 innecesarias, 9 heredadas

---

## 12. JUGADORES (17 columnas)

Relaciona personas con equipos (plantilla).

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Equipo | text | ✅ NECESARIA | Relación equipo (5.2) |
| Persona | text | ✅ NECESARIA | Relación persona (5.2) |
| Rol | text | ✅ NECESARIA | Jugador/Entrenador/Staff (5.2) |
| Número | text | ⚠️ DUDOSA | Dorsal jugador - visual |
| ¿Licencia? | tinyint | ✅ NECESARIA | Tiene licencia válida (5.7) |
| Nacionalidad | text | ⚠️ DUDOSA | Control extracomunitarios |
| Edición | text | ✅ NECESARIA | En qué competición |
| Habilitado categoría superior | tinyint | ✅ NECESARIA | Habilitación especial (5.1) |
| Habilitado categoría nacional | tinyint | ⚠️ DUDOSA | Habilitación nivel nacional |
| Categoría entrenador | text | ⚠️ DUDOSA | Titulación entrenador |
| Creado por árbitro | tinyint | ⚠️ DUDOSA | Control quién dio alta |
| search_text_cache | text | 🔄 HEREDADA | Cache |
| set_has_medical_insurance | bigint | ✅ NECESARIA | Mutualidad (5.7) |
| set_allowed_older | bigint | ❌ INNECESARIA | Técnico |

**Resumen**: 9 necesarias, 5 dudosas, 1 innecesaria, 1 heredada, 1 perdida

---

## 13. LICENCIAS (29 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Persona | text | ✅ NECESARIA | A quién pertenece (5.7) |
| Temporada | text | ✅ NECESARIA | Vigencia anual (5.7) |
| Tipo | text | ✅ NECESARIA | Jugador/Árbitro/Entrenador (5.7) |
| Fecha alta | datetime | ✅ NECESARIA | Inicio vigencia (5.7) |
| Fecha fin | datetime | ✅ NECESARIA | Fin vigencia (5.7) |
| Club | text | ✅ NECESARIA | Club de la licencia (5.7) |
| Importe | decimal | ✅ NECESARIA | Coste licencia (5.8) |
| Factura | text | ✅ NECESARIA | Relación factura (5.8) |
| Categoría | text | ✅ NECESARIA | Categoría habilitada (5.7) |
| Género | text | ⚠️ DUDOSA | M/F |
| Dirección-CP-Población-Provincia (4 cols) | ⚠️ DUDOSAS | Ya en Persona |
| Lat-Lng (2 cols) | ⚠️ DUDOSAS | Ya en Persona |
| Categoría entrenador | text | ⚠️ DUDOSA | Titulación |
| Categoría árbitro | text | ✅ NECESARIA | Nivel arbitral (5.5) |
| Habilitado nacional | tinyint | ⚠️ DUDOSA | Ámbito nacional |
| Estado | text | ✅ NECESARIA | Activa/Inactiva/Pendiente (5.7) |
| Nº licencia | bigint | ✅ NECESARIA | Número oficial (5.7) |
| Habilitado categoría superior | tinyint | ⚠️ DUDOSA | Duplicado jugadores? |
| Fecha mutua | datetime | ✅ NECESARIA | Seguro deportivo (5.7) |
| Equipos | text | 🔄 HEREDADA | Denormalizado |
| Nombre | text | 🔄 HEREDADA | Ya en Persona |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 15 necesarias, 8 dudosas, 0 innecesarias, 6 heredadas

---

## 14. LIQUIDACIONES (8 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Fecha | datetime | ✅ NECESARIA | Fecha liquidación (5.8) |
| Nombre | text | ✅ NECESARIA | Descripción liquidación (5.8) |
| Importe | decimal | ✅ NECESARIA | Total a pagar (5.8) |
| Personas | text | ✅ NECESARIA | Árbitros incluidos (5.8) |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 7 necesarias, 0 dudosas, 0 innecesarias, 1 heredada

---

## 15. PAGOS (17 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador |
| Fecha | datetime | ✅ NECESARIA | Cuándo se pagó (5.8) |
| Fecha de destrucción | text | ⚠️ DUDOSA | Soft delete |
| Ref | text | ✅ NECESARIA | Referencia pago (5.8) |
| Tipo | text | ✅ NECESARIA | Concepto: Licencia/Inscripción/Arbitraje (5.8) |
| Importe | decimal | ✅ NECESARIA | Cantidad (5.8) |
| Club | text | ⚠️ DUDOSA | Pagador (mejor normalizado) |
| Persona | text | ⚠️ DUDOSA | Pagador (mejor normalizado) |
| Equipo | text | ⚠️ DUDOSA | Relación equipo |
| Jugador | text | ⚠️ DUDOSA | Relación jugador |
| Descripción | text | ✅ NECESARIA | Detalle pago (5.8) |
| Factura | text | ✅ NECESARIA | Relación factura (5.8) |
| Licencia | text | ⚠️ DUDOSA | Relación licencia |
| Cliente | text | ❌ INNECESARIA | Sistema legacy |
| Token | text | 🔄 HEREDADA | Sistema legacy |
| Partido | text | ⚠️ DUDOSA | Pago arbitraje partido |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 7 necesarias, 7 dudosas, 1 innecesaria, 2 heredadas

---

## 16. PERSONAS (31 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Nombre | text | ✅ NECESARIA | Identificación (5.1) |
| NIF | text | ✅ NECESARIA | Identificación legal (5.1, 5.8) |
| Fecha de nacimiento | datetime | ✅ NECESARIA | Control edad/categorías (5.1) |
| Sexo | text | ✅ NECESARIA | M/F (5.1) |
| Teléfono | bigint | ✅ NECESARIA | Contacto (5.1, 5.10) |
| Correo electrónico | text | ✅ NECESARIA | Contacto y notificaciones (5.1, 5.10) |
| Comentarios | text | ⚠️ DUDOSA | Notas internas |
| Usuario aplicación | text | ✅ NECESARIA | Relación usuario login (5.1) |
| Nombre2 | text | ❌ INNECESARIA | Duplicado? |
| Apellidos | text | ✅ NECESARIA | Identificación completa (5.1) |
| Dirección-CP-Población-Provincia (4 cols) | ✅ NECESARIAS | Datos personales, mutua (5.1, 5.7) |
| Lat-Lng (2 cols) | ✅ NECESARIAS | Cálculo distancias árbitros (5.5, 5.8) |
| Disponibilidad | text | ✅ NECESARIA | Disponibilidad árbitros (5.5) |
| Vacaciones | text | ✅ NECESARIA | Periodos no disponibles árbitros (5.5) |
| old_id | text | 🔄 HEREDADA | Migración sistema anterior |
| Número de cuenta | text | ✅ NECESARIA | Pagos liquidaciones (5.8) |
| Número de licencia antiguo | text | 🔄 HEREDADA | Histórico |
| Nacionalidad | text | ⚠️ DUDOSA | Control extracomunitarios |
| Zona de arbitraje | text | ✅ NECESARIA | Asignación por zona (5.5) |
| Nivel entrenador | bigint | ⚠️ DUDOSA | Titulación entrenador |
| Nivel árbitro | bigint | ✅ NECESARIA | Nivel competencia (5.5) |
| Tipo de documento | text | ⚠️ DUDOSA | DNI/NIE/Pasaporte |
| Certificado ausencia delitos | text | ⚠️ DUDOSA | Documentación legal |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 19 necesarias, 6 dudosas, 1 innecesaria, 5 heredadas

---

## 17. PLANTILLAS (14 columnas)

Plantillas de calendario (generación automática de fixtures).

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| **Todas** | - | ⚠️ DUDOSAS | Sistema generación calendarios (5.3) |

**Resumen**: Tabla técnica para generación de calendarios. Podría ser útil o podría hacerse en código.

---

## 18. TEMPORADAS (19 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Auditoría (3 cols) | ✅ NECESARIAS | Estándar |
| Nombre | text | ✅ NECESARIA | "2024/2025" (5.3) |
| status | text | ✅ NECESARIA | Activa/Inactiva (5.3) |
| Fecha de inicio-fin (2 cols) | ✅ NECESARIAS | Periodo temporada (5.3) |
| Precios | text | ⚠️ DUDOSA | JSON precios - mejor tabla |
| Temporada actual | bigint | ✅ NECESARIA | Cuál está activa (5.3) |
| Visibilidad en web | text | ⚠️ DUDOSA | Control público (5.9) |
| Abierto plazo para licencias | tinyint | ✅ NECESARIA | Control inscripción (5.7) |
| Precio KM | double | ✅ NECESARIA | Kilometraje árbitros (5.8) |
| Precio Dieta | double | ✅ NECESARIA | Dietas árbitros (5.8) |
| Sello y firma para documentos | text | ⚠️ DUDOSA | Generación docs |
| Mutua: Compañía aseguradora | text | ✅ NECESARIA | Datos mutua (5.7) |
| Mutua: Nº póliza | text | ✅ NECESARIA | Datos mutua (5.7) |
| Mutua: Fecha de alta | datetime | ✅ NECESARIA | Vigencia seguro (5.7) |
| search_text_cache | text | 🔄 HEREDADA | Cache |
| duplicate_current | bigint | ❌ INNECESARIA | Función técnica |

**Resumen**: 13 necesarias, 3 dudosas, 1 innecesaria, 2 heredadas

---

## 19. TORNEOS (42 columnas) ⚠️ **TABLA ENORME**

Similar a EDICIONES pero para torneos puntuales. **Muchas duplicaciones**.

| Grupo | Evaluación |
|-------|------------|
| Configuración básica | ✅ NECESARIAS |
| Configuración técnica deporte | ❌ INNECESARIAS (duplicado) |
| Inscripciones y fechas | ✅ NECESARIAS |
| Control | ⚠️ DUDOSAS |

**Resumen**: Necesita refactorización similar a EDICIONES.

---

## 20. USUARIOS (26 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID-Fechas (4 cols) | ✅ NECESARIAS | Auditoría |
| Email | text | ✅ NECESARIA | Login y notificaciones (5.10) |
| password_digest | text | ✅ NECESARIA | Seguridad |
| confirmation_token | text | 🔄 HEREDADA | Confirmación email |
| remember_token | text | 🔄 HEREDADA | Remember me |
| Name | text | ✅ NECESARIA | Nombre usuario |
| Habilitado | tinyint | ✅ NECESARIA | Activo/Inactivo |
| reset_digest | text | 🔄 HEREDADA | Reset password |
| reset_sent_at | datetime | 🔄 HEREDADA | Reset password |
| client_id | text | 🔄 HEREDADA | Sistema legacy |
| config | text | ⚠️ DUDOSA | Configuración usuario |
| Roles | text | ✅ NECESARIA | Admin/Club/Árbitro/etc (4) |
| Cif/Nif | text | ⚠️ DUDOSA | Identificación |
| Color | text | ❌ INNECESARIA | UI personalización |
| salary_account | text | ❌ INNECESARIA | Sistema legacy |
| default_warehouse_id | text | ❌ INNECESARIA | Sistema legacy |
| Rol principal | text | ⚠️ DUDOSA | Rol por defecto |
| **scopes** | text | ❌ INNECESARIA | **Sistema legacy permisos** |
| **notification_config** | text | ❌ INNECESARIA | **Mejor tabla separada** |
| notification_custom_channels | text | ❌ INNECESARIA | Sistema legacy |
| notification_channels | text | ❌ INNECESARIA | Sistema legacy |
| Club | bigint | ⚠️ DUDOSA | Si es usuario club |
| search_text_cache | text | 🔄 HEREDADA | Cache |

**Resumen**: 8 necesarias, 4 dudosas, 7 innecesarias, 7 heredadas

---

## 21. ZONASARBITRAJE (3 columnas)

| Columna | Tipo | Evaluación | Razón |
|---------|------|------------|-------|
| ID | bigint | ✅ NECESARIA | Identificador |
| Fecha de creación | datetime | ✅ NECESARIA | Auditoría |
| Nombre | text | ✅ NECESARIA | "Norte", "Sur", etc. (5.5) |

**Resumen**: 3 necesarias, 0 dudosas, 0 innecesarias, 0 heredadas

---

## RESUMEN GENERAL

### Tablas por estado:
- ✅ **Útiles**: 18 tablas
- ⚠️ **Necesitan refactorización**: 3 (EDICIONES, TORNEOS, COMPETICIONES)
- ❌ **Innecesarias**: 2 (CURSOS, FECHAS)

### Columnas por estado (aproximado):
- ✅ **Necesarias**: ~180 columnas (45%)
- ⚠️ **Dudosas**: ~100 columnas (25%)
- ❌ **Innecesarias**: ~60 columnas (15%)
- 🔄 **Heredadas/Legacy**: ~60 columnas (15%)

### Problemas principales identificados:

1. **DENORMALIZACIÓN EXCESIVA**: Muchos datos repetidos (Equipos tiene Categoria/Sexo que ya están en Edición)

2. **CONFIGURACIÓN TÉCNICA DEL DEPORTE**: Muchas columnas sobre sets, puntos, líberos, dimensiones de pista que no son relevantes para la gestión administrativa

3. **SISTEMA LEGACY**: Campos como `client_id`, `scopes`, `tokens`, `search_text_cache` del sistema Ruby on Rails anterior

4. **FALTA NORMALIZACIÓN**: Campos como "Personas", "Equipos", "Clubes" que deberían ser FK están como TEXT

5. **TABLAS REDUNDANTES**: EDICIONES y TORNEOS tienen estructura muy similar, COMPETICIONES también se repite

6. **FALTAN ENTIDADES CLAVE**:
   - **PARTIDOS**: No hay tabla de partidos! (requisito 5.4, 5.6)
   - **ACTAS**: No hay registro de actas (requisito 5.6)
   - **NOTIFICACIONES**: Sistema notificaciones (requisito 5.10)
   - **FACTURAS**: Tabla facturas (requisito 5.8)
   - **DOCUMENTOS**: Gestión documentación (requisito 5.2)

### Recomendaciones:

1. **Eliminar**: CURSOS, FECHAS completas
2. **Simplificar**: Quitar 60+ columnas innecesarias
3. **Refactorizar**: EDICIONES, TORNEOS, COMPETICIONES (unificar/separar)
4. **Normalizar**: Convertir campos TEXT a FK donde corresponda
5. **Crear**: PARTIDOS, ACTAS, NOTIFICACIONES, FACTURAS, DOCUMENTOS
6. **Limpiar**: Eliminar todas las columnas legacy (tokens, client_id, etc.)

### Prioridad de acción:

**ALTA**: Crear PARTIDOS, ACTAS, NOTIFICACIONES
**MEDIA**: Refactorizar EDICIONES/TORNEOS, Normalizar FKs
**BAJA**: Limpiar legacy, Optimizar duplicados
