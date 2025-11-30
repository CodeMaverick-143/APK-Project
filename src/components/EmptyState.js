import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { TYPOGRAPHY, SPACING } from '../constants/Theme';

const EmptyState = ({ message, subMessage }) => {
    const { colors, spacing } = useTheme();

    return (
        <View style={[styles.container, { marginTop: spacing.xxl, padding: spacing.xl }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surface, marginBottom: spacing.m, padding: spacing.l }]}>
                <Ionicons name="clipboard-outline" size={64} color={colors.primary} />
            </View>
            <Text style={[styles.message, { color: colors.text, marginBottom: spacing.xs }]}>{message || "No tasks yet"}</Text>
            <Text style={[styles.subMessage, { color: colors.textSecondary }]}>{subMessage || "Add a task to get started"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    message: {
        ...TYPOGRAPHY.h3,
        textAlign: 'center',
    },
    subMessage: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
    },
});

export default EmptyState;
