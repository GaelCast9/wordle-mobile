// src/components/LetterGrid.tsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Letter {
  letter: string;
  value: number; // 1: correcta, 2: posición incorrecta, 3: no está
}

interface Props {
  feedbacks: Letter[][];
}

const LetterGrid: React.FC<Props> = ({ feedbacks }) => {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 5 }).map((_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: 5 }).map((_, col) => {
            const feedback = feedbacks[row]?.[col];
            const letter = feedback?.letter || '';
            const value = feedback?.value;

            const bgColor =
              value === 1
                ? '#4ade80' // verde
                : value === 2
                ? '#facc15' // amarillo
                : value === 3
                ? '#9ca3af' // gris
                : '#e5e7eb'; // gris claro por defecto

            return (
              <Animated.View key={col} style={[styles.cell, { backgroundColor: bgColor }]}>
                <Text style={styles.letter}>{letter}</Text>
              </Animated.View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  cell: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  letter: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
});

export default LetterGrid;
