import axios from 'axios';
import API_URL from '@/config';

const login = async (email: string, password: string) => {
  try {
    const data = { email, password };
    console.log('Datos que se van a enviar:', data);

    const response = await axios.post(`${API_URL}/Usuarios/login`, data);
    console.log('Respuesta del servidor:', response.data);

    if (response.data.role) {
      // Guardamos el rol en localStorage
      localStorage.setItem('userRole', response.data.role);
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Las credenciales introducidas no son correctas');
    } else {
      throw new Error('Error al iniciar sesión');
    }
  }
};

export default { login };
