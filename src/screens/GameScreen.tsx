import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { sendGuess, getNextWord } from '../services/gameService';
import LetterGrid from '../components/LetterGrid';

const windowWidth = Dimensions.get('window').width;
const WORD_INTERVAL = 5 * 60;

export default function GameScreen() {
  const { token, logout } = useAuth();
  const [guess, setGuess] = useState('');
  const [feedbacks, setFeedbacks] = useState<any[][]>([]);
  const [remaining, setRemaining] = useState(5);
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    try {
      const response = await sendGuess(guess, token!);
      if (typeof response === 'string') {
        setMessage(response);
      } else {
        setFeedbacks([...feedbacks, response.result]);
        setRemaining(prev => prev - 1);
        setMessage(response.message || '');
        if (response.won) setWon(true);
      }
    } catch (error) {
      console.error('Error al enviar intento:', error);
      setMessage('Error al procesar tu intento');
    } finally {
      setIsLoading(false);
      setGuess('');
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      const response = await getNextWord(token!);
      setMessage(response.message);
      setRemaining(5);
      setFeedbacks([]);
      setGuess('');
      setWon(false);
      await AsyncStorage.setItem('start_time', Math.floor(Date.now() / 1000).toString());
      setTimeLeft(WORD_INTERVAL);
    } catch (error) {
      console.error('Error al obtener nueva palabra:', error);
      setMessage('Error al obtener nueva palabra');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>WordGame</Text>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={logout}
            >
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gameContainer}>
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Intentos</Text>
                <Text style={styles.statusValue}>{remaining}/5</Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Nueva palabra</Text>
                <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
              </View>
            </View>

            <LetterGrid feedbacks={feedbacks} />

            {isGameOver && (
              <View style={[
                styles.resultContainer, 
                won ? styles.winContainer : styles.loseContainer
              ]}>
                <Text style={[styles.resultText, won ? styles.winText : styles.loseText]}>
                  {won ? '🎉 ¡Felicidades! Ganaste' : '😢 Te quedaste sin intentos'}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  isGameOver && styles.disabledInput
                ]}
                placeholder="Palabra de 5 letras"
                value={guess}
                onChangeText={text =>
                  setGuess(text.replace(/[^a-zA-Z]/g, '').toUpperCase())
                }
                maxLength={5}
                editable={!isGameOver && !isLoading}
                placeholderTextColor="#9ca3af"
              />
              
              <TouchableOpacity
                style={[
                  styles.guessButton,
                  (isGameOver || isLoading) && styles.disabledButton
                ]}
                onPress={handleGuess}
                disabled={isGameOver || isLoading}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.newWordButton, isLoading && styles.disabledButton]}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.newWordText}>
                {isLoading ? 'Cargando...' : 'Nueva palabra'}
              </Text>
            </TouchableOpacity>

            {message !== '' && (
              <Text style={styles.message}>{message}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  keyboardView: {
    flex: 1
  },
  container: { 
    flexGrow: 1
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
  gameContainer: {
    padding: 16,
    alignItems: 'center'
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8
  },
  statusItem: {
    alignItems: 'center'
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  resultContainer: {
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center'
  },
  winContainer: {
    backgroundColor: '#ecfdf5'
  },
  loseContainer: {
    backgroundColor: '#fef2f2'
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  winText: {
    color: '#16a34a'
  },
  loseText: {
    color: '#dc2626'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 8,
    fontSize: 16
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb'
  },
  guessButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.7
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  newWordButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%'
  },
  newWordText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 16
  },
  message: {
    textAlign: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    width: '100%'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});