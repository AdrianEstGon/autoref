import moment from 'moment';
import PriorityQueue from 'js-priority-queue';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { JSX } from 'react';

type Arbitro = {
  id: number;
  nombre: string;
  nivel: string;
  latitud: number;
  longitud: number;
  transporte: boolean;
};

type Partido = {
  id: number;
  categoriaId: number;
  fecha: string;
  lugar: string;
};

type Categoria = {
  id: number;
  minArbitros: number;
  primerArbitro: string | null;
  segundoArbitro: string | null;
  anotador: string | null;
};

type Lugar = {
  nombre: string;
  latitud: number;
  longitud: number;
};

type Estado = {
  asignaciones: Record<number, { arbitro1?: Arbitro; arbitro2?: Arbitro; anotador?: Arbitro }>;
  costo: number;
};

type Designacion = {
  arbitro1?: { nombre: string; icono: JSX.Element };
  arbitro2?: { nombre: string; icono: JSX.Element };
  anotador?: { nombre: string; icono: JSX.Element };
};

export class AsignadorArbitros {
  usuarios: Arbitro[];
  disponibilidades: any[];
  partidos: Partido[];
  categorias: Categoria[];
  lugares: Lugar[];
  designaciones: Record<number, Designacion>;

  constructor(usuarios: Arbitro[], disponibilidades: any[], designaciones: Record<number, Designacion>, partidos: Partido[], categorias: Categoria[], lugares: Lugar[]) {
    this.usuarios = usuarios;
    this.disponibilidades = disponibilidades;
    this.designaciones = designaciones;
    this.partidos = partidos;
    this.categorias = categorias;
    this.lugares = lugares;
  }

  asignarArbitros(): Record<number, Designacion> | null {
    const estadoInicial: Estado = { asignaciones: {}, costo: 0 };
    const abiertos = new PriorityQueue({ comparator: (a: Estado, b: Estado) => a.costo - b.costo });
    abiertos.queue(estadoInicial);
    let mejorEstado: Estado | null = null;

    while (abiertos.length > 0) {
      const estadoActual = abiertos.dequeue();
      
      if (this.esObjetivo(estadoActual)) {
        mejorEstado = estadoActual;
        break;
      }
      
      const nuevosEstados = this.expandirEstado(estadoActual);
      nuevosEstados.forEach(nuevoEstado => abiertos.queue(nuevoEstado));
    }
    
    return mejorEstado ? this.formatDesignaciones(mejorEstado.asignaciones) : null;
  }

  private esObjetivo(estado: Estado): boolean {
    return Object.keys(estado.asignaciones).length === this.partidos.length;
  }

  private expandirEstado(estado: Estado): Estado[] {
    const partidoSinAsignar = this.partidos.find(p => !estado.asignaciones[p.id]);
    if (!partidoSinAsignar) return [];

    const categoria = this.categorias.find(c => c.id === partidoSinAsignar.categoriaId);
    if (!categoria) return [];

    const arbitrosDisponibles = this.obtenerArbitrosDisponibles(partidoSinAsignar);
    const nuevosEstados: Estado[] = [];

    // Generar todas las combinaciones de árbitros disponibles según los requisitos de la categoría
    for (let arbitro1 of arbitrosDisponibles) {
      if (categoria.primerArbitro && this.nivelIndex(arbitro1.nivel) < this.nivelIndex(categoria.primerArbitro)) continue;

      for (let arbitro2 of arbitrosDisponibles) {
        if (categoria.segundoArbitro && this.nivelIndex(arbitro2.nivel) < this.nivelIndex(categoria.segundoArbitro)) continue;
        if (arbitro1.id === arbitro2.id) continue; // Evitar repetir el mismo árbitro

        for (let anotador of arbitrosDisponibles) {
          if (categoria.anotador && this.nivelIndex(anotador.nivel) < this.nivelIndex(categoria.anotador)) continue;
          if (arbitro1.id === anotador.id || arbitro2.id === anotador.id) continue; // Evitar repetir árbitros en diferentes roles

          const nuevoEstado: Estado = JSON.parse(JSON.stringify(estado));
          nuevoEstado.asignaciones[partidoSinAsignar.id] = { arbitro1, arbitro2, anotador };
          nuevoEstado.costo += this.calcularCosto(estado, arbitro1, partidoSinAsignar);
          nuevoEstado.costo += this.calcularCosto(estado, arbitro2, partidoSinAsignar);
          nuevoEstado.costo += this.calcularCosto(estado, anotador, partidoSinAsignar);
          nuevosEstados.push(nuevoEstado);
        }
      }
    }

    return nuevosEstados;
  }

  private obtenerArbitrosDisponibles(partido: Partido): Arbitro[] {
    return this.usuarios.filter(usuario => this.cumpleCondiciones(usuario, partido));
  }

  private cumpleCondiciones(arbitro: Arbitro, partido: Partido): boolean {
    const ubicacionPartido = this.lugares.find(l => l.nombre === partido.lugar);
    if (!ubicacionPartido) return false;
  
    const categoria = this.categorias.find(cat => cat.id === partido.categoriaId);
    if (!categoria) return false;
  
    const franja = this.obtenerFranjaHoraria(partido.fecha);
    const disponibilidad = this.disponibilidades.find(d => d.usuarioId === arbitro.id);
  
    if (!disponibilidad || !disponibilidad[franja]) return false;
  
    const estado = disponibilidad[franja];
    if (estado === 3) return false;
  
    // Asignamos transporte a una copia del árbitro
    arbitro.transporte = estado === 1;
    return true;
  }
  
  private obtenerFranjaHoraria(fechaStr: string): string {
    const hora = moment(fechaStr).hour();
  
    if (hora >= 9 && hora < 12) return 'franja1';
    if (hora >= 12 && hora < 15) return 'franja2';
    if (hora >= 15 && hora < 18) return 'franja3';
    if (hora >= 18 && hora < 21) return 'franja4';
  
    return '';
  }
  

  private calcularCosto(estado: Estado, arbitro: Arbitro, partido: Partido): number {
    const ubicacionPartido = this.lugares.find(l => l.nombre === partido.lugar);
    if (!ubicacionPartido) return Infinity;
    return this.calcularDistancia(arbitro.latitud, arbitro.longitud, ubicacionPartido.latitud, ubicacionPartido.longitud);
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private nivelIndex(nivel: string): number {
    const niveles = ["Candidato Territorial I Pista", "Nivel I Pista", "Nivel I + Hab. Nivel II Pista", "Nivel II Pista", "Nivel II + Hab. Nacional C Pista", "Nacional C Pista", "Nacional B Pista", "Nacional A Pista", "Internacional Pista"];
    return niveles.indexOf(nivel);
  }

  private formatDesignaciones(asignaciones: Estado["asignaciones"]): Record<number, Designacion> {
    const designaciones: Record<number, Designacion> = {};
    Object.entries(asignaciones).forEach(([partidoId, asignacion]) => {
      designaciones[parseInt(partidoId)] = {
        arbitro1: asignacion.arbitro1 ? { nombre: asignacion.arbitro1.nombre, icono: <DirectionsCarIcon style={{ color: 'blue' }} /> } : undefined,
        arbitro2: asignacion.arbitro2 ? { nombre: asignacion.arbitro2.nombre, icono: <DirectionsWalkIcon style={{ color: 'green' }} /> } : undefined,
        anotador: asignacion.anotador ? { nombre: asignacion.anotador.nombre, icono: <DirectionsWalkIcon style={{ color: 'red' }} /> } : undefined
      };
    });
    return designaciones;
  }
}
