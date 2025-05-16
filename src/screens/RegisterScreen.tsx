import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.109:3000'; // Asegúrate de usar tu IP local real

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (username.length < 3 || password.length < 3) {
      setError('El usuario y contraseña deben tener al menos 3 caracteres');
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente', [
        {
          text: 'Iniciar sesión',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 'No se pudo registrar el usuario'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
