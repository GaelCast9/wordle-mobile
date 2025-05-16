import axios from 'axios';

const API_URL = 'http://192.168.0.109:3000'; // IP local válida para móvil físico

export const login = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    return res.data.access_token;
  } catch (error: any) {
    console.error('❌ Error en login:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Error desconocido al iniciar sesión'
    );
  }
};
