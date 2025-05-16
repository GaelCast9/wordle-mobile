import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface Letter {
  letter: string;
  value: number; // 1: correcta, 2: posición incorrecta, 3: no está
}

interface Props {
  feedbacks: Letter[][];
}

const windowWidth = Dimensions.get('window').width;
const GRID_PADDING = 20;
const CELL_GAP = 8;

const LetterGrid: React.FC<Props> = ({ feedbacks }) => {
  // Calculando el tamaño de celda responsivo para diferentes tamaños de pantalla
  const gridWidth = Math.min(windowWidth - GRID_PADDING * 2, 350);
  const cellSize = (gridWidth - (CELL_GAP * 4)) / 5;
  
  const getLetter = (row: number, col: number) => {
    return feedbacks[row]?.[col]?.letter || '';
  };
  
  const getBackgroundColor = (row: number, col: number) => {
    const value = feedbacks[row]?.[col]?.value;
    
    if (value === 1) return '#4ade80'; // verde - correcta
    if (value === 2) return '#facc15'; // amarillo - posición incorrecta
    if (value === 3) return '#9ca3af'; // gris - no está
    return '#e5e7eb'; // gris claro - sin intento
  };

  return (
    <View style={styles.gridContainer}>
      <View style={[styles.grid, { width: gridWidth }]}>
        {Array.from({ length: 5 }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: 5 }).map((_, col) => {
              const backgroundColor = getBackgroundColor(row, col);
              const letter = getLetter(row, col);
              
              return (
                <Animated.View 
                  key={col} 
                  style={[
                    styles.cell, 
                    { 
                      backgroundColor, 
                      width: cellSize, 
                      height: cellSize 
                    }
                  ]}
                >
                  <Text style={styles.letter}>{letter}</Text>
                </Animated.View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16
  },
  grid: {
    alignSelf: 'center'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: CELL_GAP
  },
  cell: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: CELL_GAP / 2
  },
  letter: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    textTransform: 'uppercase'
  },
});

export default LetterGrid;