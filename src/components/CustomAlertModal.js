import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { GLASS, SHADOWS, TYPOGRAPHY } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

const CustomAlertModal = ({ visible, type = 'info', title, message, onClose, onConfirm, confirmText = 'OK', cancelText = 'Cancel', showCancel = false }) => {
    const { colors, isDark } = useTheme();
    const [showModal, setShowModal] = useState(visible);
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        toggleModal(visible);
    }, [visible]);

    const toggleModal = (visible) => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 15,
                    stiffness: 150,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowModal(false));
        }
    };

    if (!showModal) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'x-circle';
            case 'warning': return 'alert-triangle';
            default: return 'info';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return colors.success;
            case 'error': return colors.error;
            case 'warning': return colors.warning;
            default: return colors.info;
        }
    };

    const themeColor = getColor();

    return (
        <Modal transparent visible={showModal} onRequestClose={onClose} animationType="none">
            <View style={styles.overlay}>
                <Animated.View style={[styles.backdrop, { opacity: opacityValue, backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }]} />

                <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
                    <BlurView
                        intensity={GLASS.intensity}
                        tint={isDark ? 'dark' : 'light'}
                        style={[
                            styles.alertBox,
                            {
                                borderColor: colors.border,
                                backgroundColor: colors.surface,
                                shadowColor: themeColor,
                            },
                            SHADOWS.medium
                        ]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: themeColor + '20' }]}>
                            <Feather name={getIcon()} size={32} color={themeColor} />
                        </View>

                        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

                        <View style={styles.buttonContainer}>
                            {showCancel && (
                                <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}>
                                    <Text style={[styles.buttonText, { color: colors.textSecondary }]}>{cancelText}</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={onConfirm || onClose}
                                style={[styles.button, styles.confirmButton, { backgroundColor: themeColor, shadowColor: themeColor }]}
                            >
                                <Text style={[styles.buttonText, { color: '#FFF' }]}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: width * 0.85,
        maxWidth: 400,
        alignItems: 'center',
    },
    alertBox: {
        width: '100%',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        ...TYPOGRAPHY.h3,
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    confirmButton: {
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        ...TYPOGRAPHY.button,
        fontWeight: '600',
    },
});

export default CustomAlertModal;
