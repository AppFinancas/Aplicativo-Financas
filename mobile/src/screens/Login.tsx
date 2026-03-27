import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors, componentStyles, spacing, typography } from '../theme';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/login', { email, senha });
      const { token, usuario } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
      
      navigation.replace('Dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.erro || 'Erro ao fazer login';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = () => {
    navigation.navigate('Cadastro');
  };

  return (
    <View style={componentStyles.screenContainer}>
      <Text style={[componentStyles.title, {justifyContent: 'flex-start'},{ marginBottom: 60 }]}>Olá, faça login</Text>
      <Text style={[componentStyles.subtitle, { marginBottom: 6 }]}>Faça login para continuar com suas finanças</Text>

      <Text style={componentStyles.inputText}>Email</Text>
      <TextInput
        style={[componentStyles.input, { marginBottom: spacing.sm }]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="seu@email.com"
      />

      <Text style={componentStyles.inputText}>Senha</Text>
      <TextInput
        style={[componentStyles.input,{ marginBottom: spacing.sm }]}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="********"
      />
      <TouchableOpacity onPress={handleLogin} style={componentStyles.buttonPrimary}>
        <Text style={[componentStyles.buttonPrimaryText]}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCadastro} style={componentStyles.buttonOff}>
        <Text style={componentStyles.buttonOffText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
;