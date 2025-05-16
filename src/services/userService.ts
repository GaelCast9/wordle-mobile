// src/services/userService.ts
import axios from 'axios';

const API_URL = 'http://192.168.0.109:3000'; // 👈 Usa la IP de tu PC, no localhost

export const getStats = async (token: string) => {
  const res = await axios.get(`${API_URL}/users/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getRanking = async (token: string) => {
  const res = await axios.get(`${API_URL}/users/ranking`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
