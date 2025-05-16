import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getStats } from '../services/userService';

export default function StatsScreen() {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats(token!);
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
        <Button title="Cerrar sesión" onPress={logout} color="#dc2626" />
      </View>

      {stats ? (
        <>
          <Text>Total de juegos: {stats.totalGames}</Text>
          <Text>Total de victorias: {stats.totalWins}</Text>
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
});
