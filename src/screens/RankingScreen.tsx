import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getRanking } from '../services/userService';

const windowWidth = Dimensions.get('window').width;

export default function RankingScreen() {
  const { token, logout } = useAuth();
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const data = await getRanking(token!);
      setRanking(data);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRanking();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Define colors for the top 3 players
    let rankColor = '#6b7280'; // Default color
    let backgroundColor = 'transparent';
    
    if (index === 0) {
      rankColor = '#fbbf24'; // Gold
      backgroundColor = '#fffbeb';
    } else if (index === 1) {
      rankColor = '#94a3b8'; // Silver
      backgroundColor = '#f8fafc';
    } else if (index === 2) {
      rankColor = '#b45309'; // Bronze
      backgroundColor = '#fef3c7';
    }

    return (
      <View style={[styles.rankingItem, { backgroundColor }]}>
        <View style={styles.rankPosition}>
          <Text style={[styles.rankNumber, { color: rankColor }]}>
            {index + 1}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.winCount}>{item.wins} victorias</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top 10 Jugadores</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <FlatList
          data={ranking}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4f46e5']}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay jugadores registrados</Text>
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    padding: 16
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rankPosition: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  rankNumber: {
    fontWeight: 'bold',
    fontSize: 18
  },
  userInfo: {
    flex: 1
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937'
  },
  winCount: {
    color: '#4f46e5',
    fontSize: 14,
    marginTop: 2
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280'
  }
});