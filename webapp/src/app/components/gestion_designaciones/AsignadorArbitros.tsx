import moment from 'moment';
import PriorityQueue from 'js-priority-queue';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import WarningIcon from '@mui/icons-material/Warning';
import { JSX } from 'react';

type Arbitro = {
  id: string;
  nombre: string;
  nivel: string;
  latitud: number;
  longitud: number;
  transporte: boolean;
  clubId?: string; // <- Nuevo campo opcional
};

type Partido = {
  hora: string;
  id: string;
  categoriaId: number;
  fecha: string;
  lugar: string;
  clubIdLocal?: string;
  clubIdVisitante?: string;
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
  estadoActual: Estado | null = null; 

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
    const abiertos = new PriorityQueue({
      comparator: (a: Estado, b: Estado) => {
        const asignadosA = this.contarPartidosRealmenteAsignados(a.asignaciones);
        const asignadosB = this.contarPartidosRealmenteAsignados(b.asignaciones);
    
        if (asignadosB !== asignadosA) {
          return asignadosB - asignadosA; // Más partidos realmente asignados primero
        }
        return a.costo - b.costo; // Luego menor coste
      }
    });
    
    abiertos.queue(estadoInicial);
    let mejorEstado: Estado | null = null;

    while (abiertos.length > 0) {
      const estadoActual = abiertos.dequeue();
      this.estadoActual = estadoActual;
      
      if (this.esObjetivo(estadoActual)) {
        mejorEstado = estadoActual;
        break;
      }
      
      const nuevosEstados = this.expandirEstado(estadoActual);
      nuevosEstados.forEach(nuevoEstado => abiertos.queue(nuevoEstado));
    }
    
    return mejorEstado ? this.formatDesignaciones(mejorEstado.asignaciones) : null;
  }

  private contarPartidosRealmenteAsignados(asignaciones: Estado["asignaciones"]): number {
    return Object.values(asignaciones).filter(({ arbitro1, arbitro2, anotador }) => {
      const valid = (a?: Arbitro) => a && a.nombre !== 'Incompleto';
      return valid(arbitro1) || valid(arbitro2) || valid(anotador);
    }).length;
  }
  

  private esObjetivo(estado: Estado): boolean {
    return Object.keys(estado.asignaciones).length === this.partidos.length;
  }

  expandirEstado(estado: Estado): Estado[] {
    const nuevosEstados: Estado[] = [];
  
    const partidosSinAsignar = this.partidos.filter(p => !estado.asignaciones[p.id]);
  
    if (partidosSinAsignar.length === 0) return [];
  
    const partidoSinAsignar = partidosSinAsignar[0];
    const categoria = this.categorias.find(c => c.id === partidoSinAsignar.categoriaId)!;
  
    const arbitrosDisponibles = this.obtenerArbitrosDisponibles(partidoSinAsignar);
  
    const opcionesArbitro1 = categoria.primerArbitro && categoria.primerArbitro !== 'NO'
      ? arbitrosDisponibles.filter((a: { nivel: string; }) => this.nivelIndex(a.nivel) >= this.nivelIndex(categoria.primerArbitro!))
      : [];
    const opcionesArbitro2 = categoria.segundoArbitro && categoria.segundoArbitro !== 'NO'
      ? arbitrosDisponibles.filter(a => this.nivelIndex(a.nivel) >= this.nivelIndex(categoria.segundoArbitro!))
      : [];
    const opcionesAnotador = categoria.anotador && categoria.anotador !== 'NO'
      ? arbitrosDisponibles.filter(a => this.nivelIndex(a.nivel) >= this.nivelIndex(categoria.anotador!))
      : [];
  
    const combinacionesConCosto: {
      combinacion: [Arbitro | null, Arbitro | null, Arbitro | null];
      costoTotal: number;
    }[] = [];
  
    const penalizacionIncompleto = 100;

    const arbitroIncompleto: Arbitro = {
      id: 'incompleto',
      nombre: 'Incompleto',
      nivel: '',
      latitud: 0,
      longitud: 0,
      transporte: false
    };
    
  
    for (const a1 of [...opcionesArbitro1, null]) {
      for (const a2 of [...opcionesArbitro2, null]) {
        for (const an of [...opcionesAnotador, null]) {
//          if (!a1 && !a2 && !an) continue;
    
          const arbitrosAsignados = [a1, a2, an].filter(a => a !== null) as Arbitro[];
          const ids = arbitrosAsignados.map(a => a.id);
          if (new Set(ids).size !== ids.length) continue;
          if (!this.puedenAsistir(partidoSinAsignar, arbitrosAsignados)) continue;
    
          let costoTotal = arbitrosAsignados.reduce(
            (acc, arbitro) => acc + this.calcularCosto(estado, arbitro, partidoSinAsignar),
            0
          );
    
          const a1Final = a1 ?? (categoria.primerArbitro && categoria.primerArbitro !== 'NO' ? arbitroIncompleto : null);
          const a2Final = a2 ?? (categoria.segundoArbitro && categoria.segundoArbitro !== 'NO' ? arbitroIncompleto : null);
          const anFinal = an ?? (categoria.anotador && categoria.anotador !== 'NO' ? arbitroIncompleto : null);
    
          if (a1Final === arbitroIncompleto) costoTotal += penalizacionIncompleto + 2;
          if (a2Final === arbitroIncompleto) costoTotal += penalizacionIncompleto + 1;
          if (anFinal === arbitroIncompleto) costoTotal += penalizacionIncompleto;
    
          combinacionesConCosto.push({
            combinacion: [a1Final, a2Final, anFinal],
            costoTotal
          });
        }
      }
    }
    
  
    // Ordenar combinaciones por menor costo total
    combinacionesConCosto.sort((a, b) => a.costoTotal - b.costoTotal);
  
    // Tomar las primeras 5 combinaciones más prometedoras
    for (const { combinacion, costoTotal } of combinacionesConCosto.slice(0, 5)) {
      const nuevoEstado: Estado = JSON.parse(JSON.stringify(estado));
      nuevoEstado.asignaciones[partidoSinAsignar.id] = {
        arbitro1: combinacion[0] || undefined,
        arbitro2: combinacion[1] || undefined,
        anotador: combinacion[2] || undefined
      };
      nuevoEstado.costo += costoTotal;
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
  
    const franja = this.obtenerFranjaHoraria(partido.hora);
    if (!franja) return false;
  
    const fechaPartido = moment(partido.fecha).format('YYYY-MM-DD');
  
    const construirMomento = (p: Partido) => {
      const fecha = moment(p.fecha).format('YYYY-MM-DD');
      return moment(`${fecha} ${p.hora}`, 'YYYY-MM-DD HH:mm:ss');
    };
  
    for (const [partidoId, asignacion] of Object.entries(this.estadoActual?.asignaciones || {})) {
      const otroPartido = this.partidos.find(p => p.id === partidoId);
      if (!otroPartido) continue;
  
      const yaAsignado = Object.values(asignacion).some(a => a?.id === arbitro.id);
      if (!yaAsignado) continue;
  
      const duracion = 90;
  
      let primero: Partido, segundo: Partido;
      let momentoPrimero: moment.Moment, momentoSegundo: moment.Moment;
  
      const momentoActual = construirMomento(partido);
      const momentoOtro = construirMomento(otroPartido);
  
      if (momentoActual.isBefore(momentoOtro)) {
        primero = partido;
        segundo = otroPartido;
        momentoPrimero = momentoActual;
        momentoSegundo = momentoOtro;
      } else {
        primero = otroPartido;
        segundo = partido;
        momentoPrimero = momentoOtro;
        momentoSegundo = momentoActual;
      }
  
      const anticipacionPrimero = this.obtenerAnticipacion(primero);
      const anticipacionSegundo = this.obtenerAnticipacion(segundo);
      const tiempoTransporte = this.estimarTiempoTransporte(arbitro, primero, segundo);
  
      const inicioPrimero = momentoPrimero.clone().subtract(anticipacionPrimero, 'minutes');
      const finPrimero = inicioPrimero.clone().add(duracion + anticipacionPrimero, 'minutes');
  
      const inicioSegundo = momentoSegundo.clone().subtract(anticipacionSegundo + tiempoTransporte, 'minutes');
      const finSegundo = inicioSegundo.clone().add(duracion + anticipacionSegundo + tiempoTransporte, 'minutes');
  
      if (finPrimero.isAfter(inicioSegundo)) {
        return false;
      }
    }
  
    const disponibilidad = this.disponibilidades.find(d =>
      d.usuarioId === arbitro.id &&
      moment(d.fecha).format('YYYY-MM-DD') === fechaPartido
    );
  
    if (!disponibilidad || !disponibilidad[franja]) return false;
  
    const estado = disponibilidad[franja];
    if (estado === 3) return false;
  
    arbitro.transporte = estado === 1;
    return true;
  }
  
  private obtenerAnticipacion(partido: Partido): number {
    const categoria = this.categorias.find(c => c.id === partido.categoriaId);
    if (!categoria) return 30;
  
    const nombreCategoria = (categoria as any).nombre?.toUpperCase() || '';
  
    if (nombreCategoria.includes("NACIONAL") || nombreCategoria.includes("SUPERLIGA")) {
      return 60;
    }
  
    return 30;
  }
  
  
  
  private obtenerFranjaHoraria(horaStr: string): string {
    const hora = moment(horaStr, 'HH:mm:ss').hour();
  
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

  private estimarTiempoTransporte(arbitro: Arbitro, desde: Partido, hasta: Partido): number {
    const origen = this.lugares.find(l => l.nombre === desde.lugar);
    const destino = this.lugares.find(l => l.nombre === hasta.lugar);
    if (!origen || !destino) return 0;
  
    const distancia = this.calcularDistancia(origen.latitud, origen.longitud, destino.latitud, destino.longitud);
  
    let tieneTransporte = arbitro.transporte;
  
    // Si NO tiene transporte, vemos si algún compañero asignado al mismo partido puede llevarlo
    if (!tieneTransporte && this.estadoActual) {
      const asignacionDesde = this.estadoActual.asignaciones[desde.id];
      if (asignacionDesde) {
        const compañeros = [asignacionDesde.arbitro1, asignacionDesde.arbitro2, asignacionDesde.anotador]
          .filter(a => a && a.id !== arbitro.id) as Arbitro[];
  
        const alguienCercaConTransporte = compañeros.some(comp =>
          comp.transporte &&
          this.calcularDistancia(comp.latitud, comp.longitud, arbitro.latitud, arbitro.longitud) <= 10
        );
  
        if (alguienCercaConTransporte) {
          tieneTransporte = true;
        }
      }
    }
  
    // Cálculo final del tiempo estimado
    if (tieneTransporte) {
      return distancia > 10.0
        ? Math.round((distancia / 60) * 90) // >10km → 90km/h
        : Math.round(distancia * 1.2);      // ≤10km → 1.2 min/km
    } else {
      return Math.round(distancia * 4);     // Caminando → 4 min/km
    }
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

        if (arbitro.nombre === "Incompleto") {
          return {
            nombre: "Incompleto",
            icono: <WarningIcon style={{ color: 'orange' }} />
          };
        }
  
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
