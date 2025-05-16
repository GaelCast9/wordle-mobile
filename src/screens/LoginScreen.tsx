import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Credenciales inválidas o error en el servidor');
      } else {
        setError('');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error inesperado al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
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
      <Button title="Entrar" onPress={handleLogin} />
      <View style={{ marginTop: 10 }} />
      <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
