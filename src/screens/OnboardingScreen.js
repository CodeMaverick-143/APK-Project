import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { SHADOWS, TYPOGRAPHY, SPACING } from '../constants/Theme';

const OnboardingScreen = () => {
    const { completeOnboarding } = useAuth();
    const { colors, spacing } = useTheme();

    const DoneButton = ({ ...props }) => (
        <TouchableOpacity style={[styles.doneButton, { backgroundColor: colors.primary, marginRight: spacing.l }]} {...props}>
            <Text style={[styles.doneButtonText, { color: colors.surface }]}>Get Started</Text>
        </TouchableOpacity>
    );

    const NextButton = ({ ...props }) => (
        <TouchableOpacity style={[styles.nextButton, { marginRight: spacing.l }]} {...props}>
            <Text style={[styles.nextButtonText, { color: colors.primary }]}>Next</Text>
        </TouchableOpacity>
    );

    const SkipButton = ({ ...props }) => (
        <TouchableOpacity style={[styles.skipButton, { marginLeft: spacing.l }]} {...props}>
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
    );

    return (
        <Onboarding
            onSkip={completeOnboarding}
            onDone={completeOnboarding}
            DoneButtonComponent={DoneButton}
            NextButtonComponent={NextButton}
            SkipButtonComponent={SkipButton}
            bottomBarHighlight={false}
            containerStyles={{ backgroundColor: colors.background }}
            pages={[
                {
                    backgroundColor: colors.background,
                    image: <Feather name="check-square" size={120} color={colors.primary} />,
                    title: 'Manage Tasks Easily',
                    subtitle: 'Create, organize, and track your daily tasks with a simple and intuitive interface.',
                    titleStyles: [styles.title, { color: colors.text }],
                    subTitleStyles: [styles.subtitle, { color: colors.textSecondary }],
                },
                {
                    backgroundColor: colors.background,
                    image: <MaterialIcons name="swipe" size={120} color={colors.secondary} />,
                    title: 'Swipe Gestures',
                    subtitle: 'Swipe left to complete tasks, swipe right to delete. It feels natural and fast.',
                    titleStyles: [styles.title, { color: colors.text }],
                    subTitleStyles: [styles.subtitle, { color: colors.textSecondary }],
                },
                {
                    backgroundColor: colors.background,
                    image: <MaterialIcons name="drag-handle" size={120} color={colors.info} />,
                    title: 'Drag & Drop',
                    subtitle: 'Prioritize your day by dragging and dropping tasks to reorder them instantly.',
                    titleStyles: [styles.title, { color: colors.text }],
                    subTitleStyles: [styles.subtitle, { color: colors.textSecondary }],
                },
                {
                    backgroundColor: colors.background,
                    image: <Feather name="tag" size={120} color={colors.warning} />,
                    title: 'Categories & Priorities',
                    subtitle: 'Stay organized with color-coded priorities and categories for Work, Personal, and Study.',
                    titleStyles: [styles.title, { color: colors.text }],
                    subTitleStyles: [styles.subtitle, { color: colors.textSecondary }],
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    title: {
        ...TYPOGRAPHY.h1,
        marginBottom: SPACING.s,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        paddingHorizontal: SPACING.l,
    },
    doneButton: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 20,
    },
    doneButtonText: {
        ...TYPOGRAPHY.button,
    },
    nextButton: {
    },
    nextButtonText: {
        ...TYPOGRAPHY.button,
    },
    skipButton: {
    },
    skipButtonText: {
        ...TYPOGRAPHY.button,
    },
});

export default OnboardingScreen;
