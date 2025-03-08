import axios from 'axios';
import API_URL from '@/config';

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Error en la autenticación:', error);
    throw error;
  }
};

export default { login };
