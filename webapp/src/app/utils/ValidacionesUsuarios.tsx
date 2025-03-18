// validaciones.ts
export function validaciones(nuevoUsuario: { nombre: string; primerApellido: string; segundoApellido: string; fechaNacimiento: string; nivel: string; clubVinculado: string; licencia: string; username: string; email: string; password: string; direccion: string; pais: string; region: string; ciudad: string; codigoPostal: string; esAdmin: boolean; }, erroresTemp: { nombre: string; primerApellido: string; segundoApellido: string; fechaNacimiento: string; nivel: string; clubVinculado: string; licencia: string; username: string; email: string; password: string; direccion: string; pais: string; region: string; ciudad: string; codigoPostal: string; esAdmin: string; }, isValid: boolean) {
  if (!validarNombre(nuevoUsuario.nombre)) {
    erroresTemp.nombre = 'Nombre no válido. Solo se permiten caracteres alfabéticos y espacios.';
    isValid = false;
  } else {
    erroresTemp.nombre = '';
  }

  if (!validarNombre(nuevoUsuario.primerApellido)) {
    erroresTemp.primerApellido = 'Primer apellido no válido. Solo se permiten caracteres alfabéticos y espacios.';
    isValid = false;
  } else {
    erroresTemp.primerApellido = '';
  }

  if (nuevoUsuario.segundoApellido && !validarNombre(nuevoUsuario.segundoApellido)) {
    erroresTemp.segundoApellido = 'Segundo apellido no válido. Solo se permiten caracteres alfabéticos y espacios.';
    isValid = false;
  } else {
    erroresTemp.segundoApellido = '';
  }

  if (!validarEmail(nuevoUsuario.email)) {
    erroresTemp.email = 'Correo electrónico no válido.';
    isValid = false;
  } else {
    erroresTemp.email = '';
  }

  if (!validarNumeroLicencia(nuevoUsuario.licencia)) {
    erroresTemp.licencia = 'Número de licencia no válido. Debe ser un número positivo.';
    isValid = false;
  } else {
    erroresTemp.licencia = '';
  }

  if (!validarCodigoPostal(nuevoUsuario.codigoPostal)) {
    erroresTemp.codigoPostal = 'Código postal no válido. Debe tener exactamente 5 dígitos.';
    isValid = false;
  } else {
    erroresTemp.codigoPostal = '';
  }

  if (!nuevoUsuario.nivel) {
    erroresTemp.nivel = 'Debe seleccionar un nivel.';
    isValid = false;
  } else {
    erroresTemp.nivel = '';
  }

  if (!nuevoUsuario.clubVinculado) {
    erroresTemp.clubVinculado = '';
  }

  if (!nuevoUsuario.fechaNacimiento) {
    erroresTemp.fechaNacimiento = 'Debe ingresar una fecha de nacimiento.';
    isValid = false;
  } else {
    erroresTemp.fechaNacimiento = '';
  }

  if (!nuevoUsuario.direccion) {
    erroresTemp.direccion = 'Debe ingresar una dirección.';
    isValid = false;
  } else {
    erroresTemp.direccion = '';
  }

  if (!nuevoUsuario.pais) {
    erroresTemp.pais = 'Debe ingresar un país.';
    isValid = false;
  } else {
    erroresTemp.pais = '';
  }

  if (!nuevoUsuario.region) {
    erroresTemp.region = 'Debe ingresar una región.';
    isValid = false;
  } else {
    erroresTemp.region = '';
  }

  if (!nuevoUsuario.ciudad) {
    erroresTemp.ciudad = 'Debe ingresar una ciudad.';
    isValid = false;
  } else {
    erroresTemp.ciudad = '';
  }
  return isValid;
  };
  
 const validarNombre = (nombre: string): boolean => {
    // Permite solo caracteres alfabéticos y espacios
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/;
    console.log(regex.test(nombre));
    console.log(nombre);
    return regex.test(nombre);
  };
  
  const validarEmail = (email: string): boolean => {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validarNumeroLicencia = (licencia: string): boolean => {
    // Verifica que la licencia sea un número positivo
    const numero = parseInt(licencia, 10);
    return !isNaN(numero) && numero > 0;
  };
  
  const validarCodigoPostal = (codigoPostal: string): boolean => {
    // Verifica que el código postal tenga exactamente 5 dígitos
    const regex = /^\d{5}$/;
    return regex.test(codigoPostal);
  };
  