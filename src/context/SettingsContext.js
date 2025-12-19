import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        theme: 'system', // 'light', 'dark', 'system'
        layout: 'comfortable', // 'compact', 'comfortable', 'expanded'
        gestureSensitivity: 1.0,
        hapticsEnabled: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('appSettings');
                if (storedSettings) {
                    setSettings(JSON.parse(storedSettings));
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const updateSettings = async (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        try {
            await AsyncStorage.setItem('appSettings', JSON.stringify(updated));
        } catch (error) {
            console.error("Failed to save settings", error);
        }
    };

    const resetSettings = async () => {
        const defaultSettings = {
            theme: 'system',
            layout: 'comfortable',
            gestureSensitivity: 1.0,
            hapticsEnabled: true,
        };
        setSettings(defaultSettings);
        try {
            await AsyncStorage.setItem('appSettings', JSON.stringify(defaultSettings));
        } catch (error) {
            console.error("Failed to reset settings", error);
        }
    };

    const resetAppData = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error("Failed to clear app data", error);
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                loading,
                updateSettings,
                resetSettings,
                resetAppData,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
