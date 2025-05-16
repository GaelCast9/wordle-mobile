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
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

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
          <View style={styles.logoContainer}>
            {/* Puedes reemplazar esto con tu logo */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>W</Text>
            </View>
            <Text style={styles.appName}>WordGame</Text>
          </View>
          
          <Text style={styles.title}>Iniciar sesión</Text>
          
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
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Regístrate</Text>
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
    justifyContent: 'center',
    padding: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white'
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  registerText: {
    color: '#6b7280'
  },
  registerLink: {
    color: '#4f46e5',
    fontWeight: 'bold'
  }
});