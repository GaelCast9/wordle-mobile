// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextProps {
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  // ⚠️ Siempre forzar login: no cargar token desde AsyncStorage
  useEffect(() => {
    setToken(null); // <-- Así se fuerza que siempre empiece desde login
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post('http://192.168.0.109:3000/auth/login', {
        username,
        password,
      });
      const receivedToken = res.data.access_token;
      console.log('✅ Token recibido al iniciar sesión:', receivedToken);
      setToken(receivedToken);
      await AsyncStorage.setItem('token', receivedToken); // Puedes eliminar esta línea si tampoco quieres guardar token
      return true;
    } catch (err) {
      console.error('❌ Error en login:', err);
      return false;
    }
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
    console.log('👋 Sesión cerrada y token eliminado');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
