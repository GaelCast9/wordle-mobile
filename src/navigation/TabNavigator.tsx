// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GameScreen from '../screens/GameScreen';
import StatsScreen from '../screens/StatsScreen';
import RankingScreen from '../screens/RankingScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Juego" component={GameScreen} />
      <Tab.Screen name="Estadísticas" component={StatsScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
