import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function Dashboard({ navigation }: any) {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('usuario');
      if (userStr) setUsuario(JSON.parse(userStr));
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    navigation.replace('Login');
  };

  const testarRotaProtegida = async () => {
    try {
      const response = await api.get('/perfil');
      Alert.alert('Sucesso', `Bem-vindo, ${response.data.nome}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a rota protegida');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {usuario && <Text>Olá, {usuario.nome}!</Text>}
      <Button title="Testar rota protegida" onPress={testarRotaProtegida} />
      <Button title="Sair" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});