import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await client.post('/auth/login', { email, password });
            const { token, user } = response.data;

            setUserToken(token);
            setUser(user);
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));
        } catch (error) {
            console.log('Login error', error);
            alert('Login failed: ' + (error.response?.data?.message || 'Something went wrong'));
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        setIsLoading(true);
        try {
            const response = await client.post('/auth/signup', { name, email, password });
            const { token, user } = response.data;

            setUserToken(token);
            setUser(user);
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));
        } catch (error) {
            console.log('Signup error', error);
            alert('Signup failed: ' + (error.response?.data?.message || 'Something went wrong'));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUser(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setIsLoading(false);
    };

    const completeOnboarding = async () => {
        setIsFirstLaunch(false);
        await AsyncStorage.setItem('alreadyLaunched', 'true');
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userData = await AsyncStorage.getItem('userData');
            let alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');

            if (alreadyLaunched === null) {
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }

            if (userToken) {
                setUserToken(userToken);
                setUser(JSON.parse(userData));
            }
            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn error ${e}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const updateProfile = async (data) => {
        try {
            const response = await client.put('/auth/profile', data);
            const updatedUser = response.data.user;
            setUser(updatedUser);
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            return true;
        } catch (error) {
            console.log('Update profile error', error);
            alert('Update failed: ' + (error.response?.data?.message || 'Something went wrong'));
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            login,
            signup,
            logout,
            completeOnboarding,
            updateProfile,
            isLoading,
            userToken,
            user,
            isFirstLaunch
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
