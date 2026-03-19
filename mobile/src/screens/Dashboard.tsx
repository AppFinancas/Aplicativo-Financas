import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard({ navigation }: any) {
  const [usuario, setUsuario] = useState<any>(null);
  const { saldoTotal, gastosCategoria, ultimasTransacoes, loading, error, refresh } = useDashboard();

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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {usuario && <Text>Olá, {usuario.nome}!</Text>}
      
      <Text style={{ marginTop: 16, fontSize: 18 }}>Saldo total: {saldoTotal}</Text>

      <Text style={{ marginTop: 24, fontSize: 18 }}>Gastos por categoria</Text>
      {loading ? (
        <Text style={{ marginTop: 8 }}>Carregando...</Text>
      ) : error ? (
        <Text style={{ marginTop: 8 }}>{error}</Text>
      ) : gastosCategoria.length === 0 ? (
        <Text style={{ marginTop: 8 }}>Sem gastos no período.</Text>
      ) : (
        <View style={{ width: '100%', marginTop: 8 }}>
          {gastosCategoria.map((gasto, idx) => (
            <Text key={idx}>
              {gasto.categoria}: {String(gasto.total_gasto)}
            </Text>
          ))}
        </View>
      )}

      <Text style={{ marginTop: 24, fontSize: 18 }}>Últimas transações</Text>
      {loading ? (
        <Text style={{ marginTop: 8 }}>Carregando...</Text>
      ) : error ? (
        <Text style={{ marginTop: 8 }}>{error}</Text>
      ) : ultimasTransacoes.length === 0 ? (
        <Text style={{ marginTop: 8 }}>Sem transações.</Text>
      ) : (
        <View style={{ width: '100%', marginTop: 8 }}>
          {ultimasTransacoes.map((t) => (
            <Text key={t.id} style={{ marginBottom: 8 }}>
              {t.data_transacao} | {t.descricao ?? t.tipo_transacao ?? 'Transação'}{' '}
              {t.produto_nome ? `(${t.produto_nome})` : ''} |{' '}
              {t.direcao === 'saida' ? '-' : '+'}
              {String(t.valor)}
              {t.categoria_nome ? ` | ${t.categoria_nome}` : ''}
            </Text>
          ))}
        </View>
      )}

      <Button title="Atualizar dashboard" onPress={refresh} />
      <Button title="Sair" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});