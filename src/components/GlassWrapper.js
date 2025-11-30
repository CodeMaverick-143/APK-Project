import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/useTheme';

const GlassWrapper = ({ children, style }) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors.gradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <SafeAreaView style={[styles.safeArea, style]}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});

export default GlassWrapper;
