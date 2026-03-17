import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Inicial from './src/screens/Inicial';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Dashboard from './src/screens/Dashboard';
import Toast from 'react-native-toast-message';

export type RootStackParamList = {
  Inicial: undefined;
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<'Inicial' | 'Dashboard'>('Inicial');
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setInitialRoute(token ? 'Dashboard' : 'Inicial');
      setTokenChecked(true);
    };
    checkToken();
  }, []);

  // Só renderiza o Stack.Navigator quando o token foi verificado
  if (!tokenChecked) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Inicial" component={Inicial} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    TwemojiMozilla: require('./node_modules/react-native-country-select/lib/assets/fonts/TwemojiMozilla.woff2'), // caminho real
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
}