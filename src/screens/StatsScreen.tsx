import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getStats } from '../services/userService';

const windowWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStats(token!);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const winRate = stats?.totalGames > 0
    ? Math.round((stats.totalVictories / stats.totalGames) * 100)
    : 0;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : stats ? (
          <>
            <Text style={styles.welcome}>Hola, Jugador</Text>
            <Text style={styles.subtitle}>Tu rendimiento</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalGames}</Text>
                <Text style={styles.statLabel}>Partidas</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalVictories}</Text>
                <Text style={styles.statLabel}>Victorias</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{winRate}%</Text>
                <Text style={styles.statLabel}>% Victoria</Text>
              </View>
            </View>

            {/* Podemos añadir más estadísticas aquí si están disponibles */}
            <View style={styles.additionalStats}>
              <Text style={styles.subtitle}>Información adicional</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Racha actual:</Text>
                  <Text style={styles.infoValue}>
                    {stats.currentStreak || 0} victorias
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mejor racha:</Text>
                  <Text style={styles.infoValue}>
                    {stats.bestStreak || 0} victorias
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Derrotas:</Text>
                  <Text style={styles.infoValue}>
                    {stats.totalGames - stats.totalWins}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>
            No se pudieron cargar las estadísticas
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fee2e2'
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500'
  },
  content: {
    padding: 16,
    paddingBottom: 30
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
    marginBottom: 12
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  additionalStats: {
    marginTop: 24
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  infoLabel: {
    fontSize: 16,
    color: '#4b5563'
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937'
  },
  errorText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#dc2626'
  }
});