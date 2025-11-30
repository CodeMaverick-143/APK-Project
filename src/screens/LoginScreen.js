import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { SHADOWS, TYPOGRAPHY } from '../constants/Theme';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const { colors, spacing } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            login(email, password);
        } else {
            Alert.alert('Error', 'Please enter email and password');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={[styles.content, { padding: spacing.xl }]}>
                <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue to Slate</Text>

                <View style={[styles.form, { marginBottom: spacing.xl }]}>
                    <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.s }]}>Email</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                                marginBottom: spacing.l
                            }
                        ]}
                        placeholder="Enter your email"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.s }]}>Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border
                            }
                        ]}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, marginTop: spacing.m }]}
                        onPress={handleLogin}
                    >
                        <Text style={[styles.buttonText, { color: colors.surface }]}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={[styles.link, { color: colors.primary }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
    },
    title: {
        ...TYPOGRAPHY.h1,
        marginBottom: 8,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        marginBottom: 32,
    },
    form: {
    },
    label: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    input: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        ...TYPOGRAPHY.body,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        ...TYPOGRAPHY.button,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        ...TYPOGRAPHY.body,
    },
    link: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
    },
});

export default LoginScreen;
