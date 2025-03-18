export function validarPartido(
    partido: {
      equipoLocal: string;
      equipoVisitante: string;
      fecha: string;
      hora: string;
      lugarId: string;
      categoria: string;
      competicion: string;
    },
    erroresTemp: {
      equipoLocal: string;
      equipoVisitante: string;
      fecha: string;
      hora: string;
      lugarId: string;
      categoria: string;
      competicion: string;
    },
    isValid: boolean
  ): boolean {
    if (!validarTexto(partido.equipoLocal)) {
      erroresTemp.equipoLocal = 'Debe seleccionarse un equipo local.';
      isValid = false;
    } else {
      erroresTemp.equipoLocal = '';
    }
  
    if (!validarTexto(partido.equipoVisitante)) {
      erroresTemp.equipoVisitante = 'Debe seleccionarse un equipo visitante.';
      isValid = false;
    } else {
      erroresTemp.equipoVisitante = '';
    }
  
    if (!partido.fecha) {
      erroresTemp.fecha = 'Debe selecionarse una fecha.';
      isValid = false;
    } else {
      erroresTemp.fecha = '';
    }
  
    if (!partido.hora) {
      erroresTemp.hora = 'Debe seleccionarse una hora.';
      isValid = false;
    } else {
      erroresTemp.hora = '';
    }

    if (!partido.lugarId) {
      erroresTemp.lugarId = 'Debe seleccionarse un polideportivo.';
      isValid = false;
    } else {
      erroresTemp.lugarId = '';
    }
  
    if (!validarTexto(partido.categoria)) {
      erroresTemp.categoria = 'La categoría no es válida.';
      isValid = false;
    } else {
      erroresTemp.categoria = '';
    }
  
    if (!validarTexto(partido.competicion)) {
      erroresTemp.competicion = 'La competición no es válida.';
      isValid = false;
    } else {
      erroresTemp.competicion = '';
    }
  
    return isValid;
  }
  
  // Función auxiliar para validar que solo haya texto alfabético y espacios
  const validarTexto = (texto: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/;
    return regex.test(texto.trim());
  };
  