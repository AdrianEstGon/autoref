import moment from 'moment';
import PriorityQueue from 'js-priority-queue';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { JSX } from 'react';

type Arbitro = {
  id: string;
  nombre: string;
  nivel: string;
  latitud: number;
  longitud: number;
  transporte: boolean;
};

type Partido = {
  id: string;
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
  asignaciones: Record<string, { arbitro1?: Arbitro; arbitro2?: Arbitro; anotador?: Arbitro }>;
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
  designaciones: Record<string, Designacion>;

  constructor(usuarios: Arbitro[], disponibilidades: any[], designaciones: Record<string, Designacion>, partidos: Partido[], categorias: Categoria[], lugares: Lugar[]) {
    this.usuarios = usuarios;
    this.disponibilidades = disponibilidades;
    this.designaciones = designaciones;
    this.partidos = partidos;
    this.categorias = categorias;
    this.lugares = lugares;
  }

  asignarArbitros(): Record<string, Designacion> | null {
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
  
    const categoriaOriginal = this.categorias.find(c => c.id === partidoSinAsignar.categoriaId);
    if (!categoriaOriginal) return [];
  
    const categoria = { ...categoriaOriginal }; // Clonamos para no modificar la original
  
    categoria.primerArbitro = categoria.primerArbitro === "NO" ? null : categoria.primerArbitro;
    categoria.segundoArbitro = categoria.segundoArbitro === "NO" ? null : categoria.segundoArbitro;
    categoria.anotador = categoria.anotador === "NO" ? null : categoria.anotador;
  
    const arbitrosDisponibles = this.obtenerArbitrosDisponibles(partidoSinAsignar);
    const combinaciones: [Arbitro | null, Arbitro | null, Arbitro | null][] = [];
  
    // Crear combinaciones posibles para arbitro1, arbitro2 y anotador
    if (categoria.primerArbitro) {
      const opcionesArbitro1 = arbitrosDisponibles.filter(a => this.nivelIndex(a.nivel) >= this.nivelIndex(categoria.primerArbitro || ""));
      for (let arbitro1 of opcionesArbitro1) {
        combinaciones.push([arbitro1, null, null]);
      }
    } else {
      combinaciones.push([null, null, null]);
    }
  
    if (categoria.segundoArbitro) {
      const opcionesArbitro2 = arbitrosDisponibles.filter(a => this.nivelIndex(a.nivel) >= this.nivelIndex(categoria.segundoArbitro || ""));
      for (let arbitro2 of opcionesArbitro2) {
        combinaciones.forEach(combinacion => {
          // Aseguramos que no se repita el mismo arbitro
          if (!combinacion[0] || combinacion[0].id !== arbitro2.id) {
            combinacion[1] = arbitro2;
          }
        });
      }
    }
  
    if (categoria.anotador) {
      const opcionesAnotador = arbitrosDisponibles.filter(a => this.nivelIndex(a.nivel) >= this.nivelIndex(categoria.anotador ||""));
      for (let anotador of opcionesAnotador) {
        combinaciones.forEach(combinacion => {
          // Aseguramos que no se repita el mismo arbitro
          if (!combinacion[0] || combinacion[0].id !== anotador.id) {
            if (!combinacion[1] || combinacion[1].id !== anotador.id) {
              combinacion[2] = anotador;
            }
          }
        });
      }
    }
  
    // Filtrar combinaciones que no cumplen con los criterios
    const combinacionesValidas = combinaciones.filter(combinacion => {
      // Filtramos los trios que pueden asistir al partido
      return this.puedenAsistir(partidoSinAsignar, combinacion.filter(a => a !== null) as Arbitro[]);
    });
  
    // Calcular el costo para cada combinación válida
    const combinacionesConCosto = combinacionesValidas.map(combinacion => {
      const costoTotal = combinacion.reduce(
        (acc, arbitro) => acc + (arbitro ? this.calcularCosto(estado, arbitro, partidoSinAsignar) : 0),
        0
      );
      return { combinacion, costoTotal };
    });
  
    // Ordenar las combinaciones por costo
    combinacionesConCosto.sort((a, b) => a.costoTotal - b.costoTotal);
  
    // Crear nuevos estados con la mejor combinación
    const nuevosEstados: Estado[] = [];
    if (combinacionesConCosto.length > 0) {
      const mejor = combinacionesConCosto[0];
      const nuevoEstado: Estado = JSON.parse(JSON.stringify(estado)); // Clonamos el estado
      nuevoEstado.asignaciones[partidoSinAsignar.id] = {
        arbitro1: mejor.combinacion[0] || undefined,
        arbitro2: mejor.combinacion[1] || undefined,
        anotador: mejor.combinacion[2] || undefined
      };
      nuevoEstado.costo += mejor.costoTotal;
      nuevosEstados.push(nuevoEstado);
    }
  
    return nuevosEstados;
  }
  
  

  private puedenAsistir(partido: Partido, arbitros: Arbitro[]): boolean {
    const lugarPartido = this.lugares.find(l => l.nombre === partido.lugar);
    if (!lugarPartido) return false;
    const { latitud: latPartido, longitud: lonPartido } = lugarPartido;
  
    return arbitros.every(arbitro => {
      if (arbitro.transporte) return true;
  
      const distanciaDirecta = this.calcularDistancia(arbitro.latitud, arbitro.longitud, latPartido, lonPartido);
      if (distanciaDirecta <= 10) return true;
  
      // Buscar un árbitro con transporte que viva a menos de 10km del árbitro sin transporte
      return arbitros.some(a =>
        a.id !== arbitro.id &&
        a.transporte &&
        this.calcularDistancia(a.latitud, a.longitud, arbitro.latitud, arbitro.longitud) <= 10
      );
    });
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
    if (!franja) return false;
  
    const fechaPartido = moment(partido.fecha).format('YYYY-MM-DD');
  
    const disponibilidad = this.disponibilidades.find(d =>
      d.usuarioId === arbitro.id &&
      moment(d.fecha).format('YYYY-MM-DD') === fechaPartido
    );
  
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

  private formatDesignaciones(asignaciones: Estado["asignaciones"]): Record<string, Designacion> {
    const designaciones: Record<string, Designacion> = {};
  
    Object.entries(asignaciones).forEach(([partidoId, asignacion]) => {
      const getIcono = (arbitro?: Arbitro) => {
        if (!arbitro) return undefined;
  
        const tieneTransporte = arbitro.transporte;
        const IconComponent = tieneTransporte ? DirectionsCarIcon : DirectionsWalkIcon;
        const color = tieneTransporte ? 'blue' : 'green';
  
        return {
          ...arbitro,
          icono: <IconComponent style={{ color }} />
        };
      };
  
      designaciones[partidoId] = {
        arbitro1: getIcono(asignacion.arbitro1),
        arbitro2: getIcono(asignacion.arbitro2),
        anotador: getIcono(asignacion.anotador)
      };
    });
  
    return designaciones;
  }
  
}
