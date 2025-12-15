// ==================== TIPOS DE USUARIO ====================
export interface Usuario {
  id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nivel: string;
  clubVinculadoId: string | null;
  clubVinculado?: string;
  licencia: string;
  email: string;
  username: string;
  password?: string;
  direccion: string;
  pais: string;
  region: string;
  ciudad: string;
  codigoPostal: string;
  esAdmin: boolean;
  fotoPerfil?: string;
}

export interface Arbitro {
  id: string;
  nombre: string;
  primerApellido?: string;
  segundoApellido?: string;
  nivel: string;
  latitud?: number;
  longitud?: number;
  transporte?: boolean;
  clubVinculadoId?: string;
  icono?: JSX.Element;
}

// ==================== TIPOS DE PARTIDO ====================
export interface Partido {
  id: string;
  equipoLocalId: string;
  equipoLocal: string;
  equipoVisitanteId: string;
  equipoVisitante: string;
  fecha: string;
  hora: string;
  lugarId: string;
  lugar: string | Polideportivo;
  categoriaId: string;
  categoria: string;
  jornada: string;
  numeroPartido: string;
  arbitro1?: string;
  arbitro1Id?: string;
  arbitro1Licencia?: string;
  estadoArbitro1?: number;
  arbitro2?: string;
  arbitro2Id?: string;
  arbitro2Licencia?: string;
  estadoArbitro2?: number;
  anotador?: string;
  anotadorId?: string;
  anotadorLicencia?: string;
  estadoAnotador?: number;
}

export interface PartidoFormData {
  equipoLocalId: string;
  equipoVisitanteId: string;
  fecha: string;
  hora: string;
  lugarId: string;
  categoriaId: string;
  jornada: string;
  numeroPartido: string;
}

// ==================== TIPOS DE EQUIPO Y CLUB ====================
export interface Equipo {
  id: string;
  nombre: string;
  clubId: string;
  categoriaId?: string;
}

export interface Club {
  id: string;
  nombre: string;
}

// ==================== TIPOS DE CATEGORÍA ====================
export interface Categoria {
  id: string;
  nombre: string;
  minArbitros: number;
  primerArbitro: string | null;
  segundoArbitro: string | null;
  anotador: string | null;
  prioridad: number;
}

// ==================== TIPOS DE POLIDEPORTIVO ====================
export interface Polideportivo {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion?: string;
}

// ==================== TIPOS DE DISPONIBILIDAD ====================
export interface Disponibilidad {
  id?: string;
  usuarioId: string;
  fecha: string;
  franja1: number; // 0 = no disponible, 1 = con transporte, 2 = sin transporte, 3 = no disponible
  franja2: number;
  franja3: number;
  franja4: number;
  comentarios?: string;
}

export interface DisponibilidadState {
  Franja1: number;
  Franja2: number;
  Franja3: number;
  Franja4: number;
  comments: string;
}

// ==================== TIPOS DE DESIGNACIÓN ====================
export interface Designacion {
  arbitro1?: ArbitroDesignacion;
  arbitro2?: ArbitroDesignacion;
  anotador?: ArbitroDesignacion;
}

export interface ArbitroDesignacion {
  nombre: string;
  icono: JSX.Element;
  id?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nivel?: string;
}

// ==================== TIPOS DE NOTIFICACIÓN ====================
export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
  usuarioId: string;
  tipo?: string;
}

// ==================== TIPOS DE ERROR ====================
export interface ValidationErrors {
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  fechaNacimiento?: string;
  nivel?: string;
  clubVinculadoId?: string;
  licencia?: string;
  username?: string;
  email?: string;
  password?: string;
  direccion?: string;
  pais?: string;
  region?: string;
  ciudad?: string;
  codigoPostal?: string;
  esAdmin?: string;
  equipoLocalId?: string;
  equipoVisitanteId?: string;
  fecha?: string;
  hora?: string;
  lugarId?: string;
  categoriaId?: string;
  jornada?: string;
  numeroPartido?: string;
}

// ==================== TIPOS DE PROPS ====================
export interface DialogFormProps {
  open: boolean;
  onClose: () => void;
}

export interface CrearUsuarioProps extends DialogFormProps {
  onSave: (usuario: Partial<Usuario>) => void;
}

export interface ModificarUsuarioProps extends DialogFormProps {
  onUpdate: () => void;
  usuario: Usuario;
}

export interface CrearPartidoProps extends DialogFormProps {
  onSave: (partido: PartidoFormData) => void;
}

export interface ModificarPartidoProps extends DialogFormProps {
  onUpdate: (partido: Partido) => void;
}

