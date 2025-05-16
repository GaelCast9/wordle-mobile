import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { getRanking } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

export default function RankingScreen() {
  const { token, logout } = useAuth();
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getRanking(token!);
      setRanking(data);
    };
    fetchRanking();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top 10 Jugadores</Text>
        <Button title="Cerrar sesión" onPress={logout} color="#dc2626" />
      </View>

      <FlatList
        data={ranking}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text>{index + 1}. {item.username} - {item.wins} victorias</Text>
        )}
      />
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
