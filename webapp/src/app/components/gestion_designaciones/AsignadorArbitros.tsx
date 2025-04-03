import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import moment from 'moment';

type Designacion = {
  arbitro1?: any;
  arbitro2?: any;
  anotador?: any;
};

export class AsignadorArbitros {
  usuarios: any[];
  disponibilidades: any[];
  designaciones: Record<number, Designacion>;
  partidosFiltrados: any[];
  categorias: any[];
  lugares: any[];

  constructor(usuarios: any[], disponibilidades: any[], designaciones: Record<number, Designacion>, partidosFiltrados: any[], categorias: any[], lugares: any[]) {
    this.usuarios = usuarios;
    this.disponibilidades = disponibilidades;
    this.designaciones = designaciones;
    this.partidosFiltrados = partidosFiltrados;
    this.categorias = categorias;
    this.lugares = lugares;
  }

  asignarArbitros(partidosSeleccionados: any[]) {
    partidosSeleccionados.forEach(partido => {
      this.asignarArbitroOptimizado(partido);
    });
  }

  asignarArbitroOptimizado(partido: any) {
    const lugar = this.lugares.find(l => l.nombre === partido.lugar);
    if (!lugar) return;

    const arbitrosDisponibles = this.obtenerArbitrosDisponibles(partido);
    if (arbitrosDisponibles.length === 0) return;

    const categoria = this.categorias.find(cat => cat.id === partido.categoriaId);
    if (!categoria) return;

    const minArbitros = categoria.minArbitros || 0;

    arbitrosDisponibles.sort((a, b) => {
      const distanciaA = this.calcularDistancia(a.latitud, a.longitud, lugar.latitud, lugar.longitud);
      const distanciaB = this.calcularDistancia(b.latitud, b.longitud, lugar.latitud, lugar.longitud);
      const nivelA = this.nivelIndex(a.nivel);
      const nivelB = this.nivelIndex(b.nivel);

      if (nivelA !== nivelB) {
        return nivelB - nivelA;
      }
      return distanciaA - distanciaB;
    });

    this.designaciones[partido.id] = {
      arbitro1: arbitrosDisponibles[0] || null,
      arbitro2: arbitrosDisponibles[1] || null,
      anotador: arbitrosDisponibles[2] || null
    };
  }

  obtenerArbitrosDisponibles(partido: any) {
    const franja = this.obtenerFranja(partido.fecha);
    return this.usuarios.filter(usuario => {
      const disponibilidad = this.disponibilidades.find(disp => disp.usuarioId === usuario.id && moment(disp.fecha).isSame(moment(partido.fecha), "day"));
      return disponibilidad && (disponibilidad[franja] === 1 || disponibilidad[franja] === 2);
    }).map(usuario => {
      const disponibilidad = this.disponibilidades.find(disp => disp.usuarioId === usuario.id && moment(disp.fecha).isSame(moment(partido.fecha), "day"));
      let icono = disponibilidad?.[franja] === 1 ? <DirectionsCarIcon style={{ color: "blue", marginRight: 5 }} /> : <DirectionsWalkIcon style={{ color: "green", marginRight: 5 }} />;
      return { ...usuario, icono, nivelIndex: this.nivelIndex(usuario.nivel) };
    });
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  nivelIndex(nivel: string): number {
    const niveles = ["Candidato Territorial I Pista", "Nivel I Pista", "Nivel I + Hab. Nivel II Pista", "Nivel II Pista", "Nivel II + Hab. Nacional C Pista", "Nacional C Pista", "Nacional B Pista", "Nacional A Pista", "Internacional Pista"];
    return niveles.indexOf(nivel);
  }

  obtenerFranja(fechaHora: string): string {
    const horaPartido = moment(fechaHora).hour();
    if (horaPartido >= 9 && horaPartido < 12) return "franja1";
    if (horaPartido >= 12 && horaPartido < 15) return "franja2";
    if (horaPartido >= 15 && horaPartido < 18) return "franja3";
    if (horaPartido >= 18 && horaPartido <= 22) return "franja4";
    return "";
  }
}
