import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.109:3000'; // Asegúrate de usar tu IP local real
const windowWidth = Dimensions.get('window').width;

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Atrás</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.title}>Crear cuenta</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  keyboardView: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  backButton: {
    padding: 8
  },
  backButtonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '500'
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 24, 
    textAlign: 'center',
    color: '#1f2937'
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#d1d5db',
    padding: 15, 
    marginBottom: 16, 
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16
  },
  error: { 
    color: '#dc2626', 
    textAlign: 'center', 
    marginBottom: 16,
    fontSize: 14
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  loginText: {
    color: '#6b7280'
  },
  loginLink: {
    color: '#4f46e5',
    fontWeight: 'bold'
  }
});