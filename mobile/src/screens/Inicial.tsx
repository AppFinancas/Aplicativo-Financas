import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { componentStyles } from '../theme';

export default function Inicial({ navigation }: any) {
  const handleLogin = async () => {
    navigation.navigate('Login');
  };

  const handleCadastro = () => {
    navigation.navigate('Cadastro');
  };

  const handleOnboarding = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <View style={componentStyles.screenContainer}>
      <Text style={[componentStyles.title, { marginBottom: 30 }]}>App Finanças</Text>
      <Text style={[componentStyles.subtitle, { marginBottom: 6 }]}>Faça login para continuar</Text>

      <TouchableOpacity onPress={handleLogin} style={componentStyles.buttonPrimary}>
        <Text style={componentStyles.buttonPrimaryText}>Faça Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCadastro} style={componentStyles.buttonPrimary}>
        <Text style={componentStyles.buttonPrimaryText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleOnboarding} style={componentStyles.buttonOff}>
        <Text style={componentStyles.buttonOffText}>Como funciona o Open Finance?</Text>
      </TouchableOpacity>
    </View>
  );
}

;