import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import GameScreen from '../screens/GameScreen';
import StatsScreen from '../screens/StatsScreen';
import RankingScreen from '../screens/RankingScreen';

const Tab = createBottomTabNavigator();

// Componentes para los iconos del TabNavigator
const GameIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
    <Text style={[styles.iconText, focused && styles.focusedText]}>🎮</Text>
  </View>
);

const StatsIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
    <Text style={[styles.iconText, focused && styles.focusedText]}>📊</Text>
  </View>
);

const RankingIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
    <Text style={[styles.iconText, focused && styles.focusedText]}>🏆</Text>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Juego" 
        component={GameScreen} 
        options={{
          tabBarIcon: ({ focused }) => <GameIcon focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Estadísticas" 
        component={StatsScreen} 
        options={{
          tabBarIcon: ({ focused }) => <StatsIcon focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Ranking" 
        component={RankingScreen} 
        options={{
          tabBarIcon: ({ focused }) => <RankingIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  focusedIcon: {
    backgroundColor: '#ede9fe',
  },
  iconText: {
    fontSize: 20,
  },
  focusedText: {
    transform: [{ scale: 1.1 }]
  }
});

export default TabNavigator;