// validaciones.ts

export const validarNombre = (nombre: string): boolean => {
    // Permite solo caracteres alfabéticos y espacios
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nombre);
  };
  
  export const validarEmail = (email: string): boolean => {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const validarNumeroLicencia = (licencia: string): boolean => {
    // Verifica que la licencia sea un número positivo
    const numero = parseInt(licencia, 10);
    return !isNaN(numero) && numero > 0;
  };
  
  export const validarCodigoPostal = (codigoPostal: string): boolean => {
    // Verifica que el código postal tenga exactamente 5 dígitos
    const regex = /^\d{5}$/;
    return regex.test(codigoPostal);
  };
  