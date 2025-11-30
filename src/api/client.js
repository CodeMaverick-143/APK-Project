import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Replace with your machine's local IP address for physical device testing
// e.g., 'http://192.168.1.10:5001'
// For Android Emulator, use 'http://10.0.2.2:5001'
// For iOS Simulator, use 'http://localhost:5001'
const BASE_URL = 'http://192.168.143.216:5001';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
client.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
