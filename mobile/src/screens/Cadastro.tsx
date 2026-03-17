import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import PhoneInput from 'react-native-international-phone-number';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../services/api';

export default function Cadastro({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirma, setSenhaConfirma] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !telefone || !senha || !senhaConfirma) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos' });
      return;
    }

    if (senha !== senhaConfirma) {
      Toast.show({ type: 'error', text1: 'As senhas não coincidem' });
      return;
    }

    const codigoPais = selectedCountry?.callingCode ?? '+55';
    const telefoneCompleto = `${codigoPais}${telefone.replace(/\D/g, '')}`;

    if (telefoneCompleto.length < 10) {
      Toast.show({ type: 'error', text1: 'Telefone inválido' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/cadastro', {
        nome,
        email,
        senha,
        telefone: telefoneCompleto,
      });

      const token = response.data?.token;
      const usuario = response.data?.usuario;

      if (token) await AsyncStorage.setItem('token', token);
      if (usuario) await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

      setLoading(false);

      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        visibilityTime: 2000,
      });

      navigation.navigate('Dashboard');

    } catch (error: any) {
      setLoading(false);
      const msg = error.response?.data?.erro || 'Erro ao criar conta';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="seu@email.com"
      />

      <Text style={styles.label}>Telefone</Text>
      <PhoneInput
        value={telefone}
        onChangePhoneNumber={setTelefone}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={setSelectedCountry}
        defaultCountry="BR"
        theme="light"
        phoneInputStyles={{
          container: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            marginBottom: 15,
          },
          flagContainer: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          },
          flag: {
            fontSize: 24,
            color: '#000',
          },
          input: {
            color: '#000',
            fontSize: 16,
            paddingVertical: 12,
          },
        }}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="********"
      />

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        value={senhaConfirma}
        onChangeText={setSenhaConfirma}
        secureTextEntry
        placeholder="********"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Cadastrar" onPress={handleCadastro} />
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLink}>
        <Text style={styles.loginText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#0066cc',
    fontSize: 16,
  },
});