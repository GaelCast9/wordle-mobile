// src/screens/GameScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { sendGuess, getNextWord } from '../services/gameService';
import LetterGrid from '../components/LetterGrid';

const WORD_INTERVAL = 5 * 60;

export default function GameScreen() {
  const { token, logout } = useAuth();
  const [guess, setGuess] = useState('');
  const [feedbacks, setFeedbacks] = useState<any[][]>([]);
  const [remaining, setRemaining] = useState(5);
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const isGameOver = won || remaining <= 0;

  useEffect(() => {
    const loadTime = async () => {
      const savedTime = await AsyncStorage.getItem('start_time');
      if (savedTime) updateTimeLeft(parseInt(savedTime, 10));
    };
    loadTime();

    const interval = setInterval(() => {
      AsyncStorage.getItem('start_time').then(saved => {
        if (saved) updateTimeLeft(parseInt(saved, 10));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTimeLeft = (startTimestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - startTimestamp;
    const left = Math.max(0, WORD_INTERVAL - elapsed);
    setTimeLeft(left);
  };

  const handleGuess = async () => {
    if (guess.length !== 5) {
      Alert.alert('Error', 'La palabra debe tener 5 letras');
      return;
    }

    const response = await sendGuess(guess, token!);
    if (typeof response === 'string') {
      setMessage(response);
    } else {
      setFeedbacks([...feedbacks, response.result]);
      setRemaining(prev => prev - 1);
      setMessage(response.message || '');
      if (response.won) setWon(true);
    }

    setGuess('');
  };

  const handleNext = async () => {
    const response = await getNextWord(token!);
    setMessage(response.message);
    setRemaining(5);
    setFeedbacks([]);
    setGuess('');
    setWon(false);
    await AsyncStorage.setItem('start_time', Math.floor(Date.now() / 1000).toString());
    setTimeLeft(WORD_INTERVAL);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Juego</Text>
        <Button title="Cerrar sesión" onPress={logout} color="#dc2626" />

        <LetterGrid feedbacks={feedbacks} />

        {isGameOver && (
          <Text style={[styles.status, won ? styles.win : styles.lose]}>
            {won ? '🎉 ¡Felicidades! Ganaste' : '😢 Te quedaste sin intentos'}
          </Text>
        )}

        <Text style={styles.remaining}>Intentos restantes: {remaining}</Text>
        <Text style={styles.timer}>Nueva palabra en: {formatTime(timeLeft)}</Text>

        <TextInput
          style={styles.input}
          placeholder="Palabra de 5 letras"
          value={guess}
          onChangeText={text =>
            setGuess(text.replace(/[^a-zA-Z]/g, '').toUpperCase())
          }
          maxLength={5}
          editable={!isGameOver}
        />

        <Button title="Enviar intento" onPress={handleGuess} disabled={isGameOver} />
        <Button title="Nueva palabra" onPress={handleNext} />

        {message !== '' && <Text style={styles.message}>{message}</Text>}

        <View style={styles.logoutContainer}>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  remaining: { textAlign: 'center', marginBottom: 10 },
  timer: { textAlign: 'center', marginBottom: 10, fontSize: 16, color: '#888' },
  message: { textAlign: 'center', marginTop: 10 },
  status: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  win: { color: '#16a34a' },
  lose: { color: '#dc2626' },
  logoutContainer: {
    marginTop: 30,
    alignSelf: 'center',
    width: '60%',
  },
});
