import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import PhoneInput from 'react-native-international-phone-number';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import { colors, componentStyles, spacing } from '../theme';

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
    <View style={componentStyles.screenContainer}>
      <Text style={componentStyles.title}>Crie sua conta</Text>
      <Text style={[componentStyles.subtitle, styles.subtitleSpacing]}>
        Comece a organizar suas finanças em poucos passos
      </Text>

      <Text style={componentStyles.inputText}>Nome Completo</Text>
      <TextInput
        style={[componentStyles.input,{ marginBottom: spacing.sm } ]}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
      />

      <Text style={componentStyles.inputText}>Email</Text>
      <TextInput
        style={[componentStyles.input,{ marginBottom: spacing.sm } ]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="seu@email.com"
      />

      <Text style={componentStyles.inputText}>Telefone</Text>
      <PhoneInput
        value={telefone}
        onChangePhoneNumber={setTelefone}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={setSelectedCountry}
        defaultCountry="BR"
        theme="light"
        phoneInputStyles={{
          container: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            marginBottom: spacing.md,
          },
          flagContainer: {
            backgroundColor: colors.surface,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          },
          flag: {
            fontSize: 24,
            color: colors.textPrimary,
          },
          input: {
            color: colors.textPrimary,
            fontSize: 16,
            paddingVertical: 12,
          },
        }}
      />

      <Text style={componentStyles.inputText}>Senha</Text>
      <TextInput
        style={[componentStyles.input,{ marginBottom: spacing.sm } ]}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="********"
      />

      <Text style={componentStyles.inputText}>Confirmar Senha</Text>
      <TextInput
        style={[componentStyles.input,{ marginBottom: spacing.sm } ]}
        value={senhaConfirma}
        onChangeText={setSenhaConfirma}
        secureTextEntry
        placeholder="********"
      />

      {loading ? (
        <View style={[componentStyles.buttonPrimary, styles.buttonSpacing]}>
          <ActivityIndicator size="small" color={colors.textOnPrimary} />
        </View>
      ) : (
        <TouchableOpacity onPress={handleCadastro} style={[componentStyles.buttonPrimary, styles.buttonSpacing]}>
          <Text style={componentStyles.buttonPrimaryText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={componentStyles.buttonOff}>
        <Text style={componentStyles.buttonOffText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitleSpacing: {
    marginBottom: spacing.lg,
  },
  buttonSpacing: {
    marginTop: spacing.sm,
  },
});