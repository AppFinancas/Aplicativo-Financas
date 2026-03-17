import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Substitua pelo IP da sua máquina na rede local
const baseURL = 'http://192.168.0.11:3000'; 

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;