import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput, Image, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../hooks/useTheme';
import ScreenWrapper from '../components/ScreenWrapper';
import { SHADOWS, TYPOGRAPHY, GLASS } from '../constants/Theme';

import CustomAlertModal from '../components/CustomAlertModal';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const { user, logout, updateProfile } = useAuth();
    const { settings, updateSettings, resetAppData } = useSettings();
    const { tasks } = useTasks();
    const { colors, spacing, isDark } = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [description, setDescription] = useState(user?.description || '');
    const [profileImage, setProfileImage] = useState(user?.profilePicture || null);

    // Custom Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'info',
        title: '',
        message: '',
        showCancel: false,
        onConfirm: () => { },
        confirmText: 'OK'
    });

    const showAlert = (type, title, message, showCancel = false, onConfirm = null, confirmText = 'OK') => {
        setModalConfig({
            type,
            title,
            message,
            showCancel,
            onConfirm: onConfirm || (() => setModalVisible(false)),
            confirmText
        });
        setModalVisible(true);
    };

    const activeTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;

    useEffect(() => {
        setName(user?.name || '');
        setDescription(user?.description || '');
        setProfileImage(user?.profilePicture || null);
    }, [user]);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                showAlert('error', 'Permission needed', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,
                base64: true,
            });

            if (!result.canceled) {
                if (result.assets[0].base64) {
                    const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
                    setProfileImage(base64Img);
                } else {
                    showAlert('error', 'Error', 'Could not process image. Please try another one.');
                }
            }
        } catch (error) {
            console.log('Image picker error:', error);
            showAlert('error', 'Error', 'Failed to pick image.');
        }
    };

    const handleSaveProfile = async () => {
        const success = await updateProfile({
            name,
            description,
            profilePicture: profileImage
        });
        if (success) {
            setIsEditing(false);
            showAlert('success', 'Success', 'Profile updated successfully!');
        }
    };

    const handleReset = () => {
        showAlert(
            'warning',
            'Reset App Data',
            'Are you sure you want to clear all data? This cannot be undone.',
            true,
            async () => {
                setModalVisible(false);
                await resetAppData();
                logout();
            },
            'Reset'
        );
    };

    const SettingSection = ({ title, children }) => (
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: spacing.m }]}>{title}</Text>
            <BlurView
                intensity={GLASS.intensity}
                tint={isDark ? 'dark' : 'light'}
                style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            >
                {children}
            </BlurView>
        </View>
    );

    const SettingRow = ({ icon, label, children, last }) => (
        <View style={[styles.settingRow, { paddingVertical: spacing.m, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }]}>
            <View style={styles.settingLabelContainer}>
                <Feather name={icon} size={20} color={colors.textSecondary} style={{ marginRight: spacing.m }} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
            </View>
            {children}
        </View>
    );

    return (
        <ScreenWrapper>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={[styles.header, { marginBottom: spacing.l, marginTop: spacing.m, paddingHorizontal: spacing.m }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                    <TouchableOpacity onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}>
                        <Text style={[styles.editButtonText, { color: colors.primary }]}>{isEditing ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View style={{ paddingHorizontal: spacing.m }}>
                    <BlurView
                        intensity={GLASS.intensity}
                        tint={isDark ? 'dark' : 'light'}
                        style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: spacing.xl }, SHADOWS.medium]}
                    >
                        <TouchableOpacity onPress={isEditing ? pickImage : null} disabled={!isEditing}>
                            <View style={[styles.avatarContainer, SHADOWS.glow]}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                                        <Text style={[styles.avatarText, { color: colors.primary }]}>{user?.name?.[0] || 'U'}</Text>
                                    </View>
                                )}
                                {isEditing && (
                                    <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                                        <Feather name="camera" size={16} color="#FFF" />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.profileInfo, { marginBottom: spacing.l }]}>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        style={[styles.nameInput, { color: colors.text, borderBottomColor: colors.primary }]}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Your Name"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                    <TextInput
                                        style={[styles.descInput, { color: colors.textSecondary, borderBottomColor: colors.primary }]}
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="Add a bio..."
                                        placeholderTextColor={colors.textSecondary}
                                        multiline
                                    />
                                </>
                            ) : (
                                <>
                                    <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>
                                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                                    {description ? <Text style={[styles.userDesc, { color: colors.textSecondary }]}>{description}</Text> : null}
                                </>
                            )}
                        </View>

                        <View style={[styles.statsRow, { borderTopColor: colors.border, paddingTop: spacing.m }]}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.text }]}>{activeTasks}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.text }]}>{completedTasks}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
                            </View>
                        </View>
                    </BlurView>
                </View>

                {/* Settings */}
                <View style={{ paddingHorizontal: spacing.m }}>
                    <SettingSection title="Personalization">
                        <SettingRow icon="moon" label="Theme">
                            <View style={[styles.toggleGroup, { backgroundColor: colors.background }]}>
                                {['Light', 'Dark', 'System'].map((mode) => (
                                    <TouchableOpacity
                                        key={mode}
                                        style={[
                                            styles.toggleButton,
                                            settings.theme === mode.toLowerCase() && { backgroundColor: colors.surface, ...SHADOWS.small }
                                        ]}
                                        onPress={() => updateSettings({ theme: mode.toLowerCase() })}
                                    >
                                        <Text style={[
                                            styles.toggleText,
                                            { color: colors.textSecondary },
                                            settings.theme === mode.toLowerCase() && { color: colors.text, fontWeight: '600' }
                                        ]}>{mode}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </SettingRow>

                        <SettingRow icon="layout" label="Layout" last>
                            <View style={[styles.toggleGroup, { backgroundColor: colors.background }]}>
                                {['Compact', 'Comfy'].map((mode) => (
                                    <TouchableOpacity
                                        key={mode}
                                        style={[
                                            styles.toggleButton,
                                            settings.layout === mode.toLowerCase() && { backgroundColor: colors.surface, ...SHADOWS.small }
                                        ]}
                                        onPress={() => updateSettings({ layout: mode.toLowerCase() })}
                                    >
                                        <Text style={[
                                            styles.toggleText,
                                            { color: colors.textSecondary },
                                            settings.layout === mode.toLowerCase() && { color: colors.text, fontWeight: '600' }
                                        ]}>{mode}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </SettingRow>
                    </SettingSection>

                    <SettingSection title="Interaction">
                        <SettingRow icon="activity" label="Haptics">
                            <Switch
                                value={settings.hapticsEnabled}
                                onValueChange={(val) => updateSettings({ hapticsEnabled: val })}
                                trackColor={{ false: colors.border, true: colors.primary }}
                            />
                        </SettingRow>

                        <View style={[styles.settingRow, { paddingVertical: spacing.m, borderTopWidth: 1, borderTopColor: colors.border }]}>
                            <View style={{ width: '100%' }}>
                                <View style={[styles.settingLabelContainer, { marginBottom: spacing.s }]}>
                                    <Feather name="move" size={20} color={colors.textSecondary} style={{ marginRight: spacing.m }} />
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>Swipe Sensitivity</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0.5}
                                    maximumValue={2.0}
                                    value={settings.gestureSensitivity}
                                    onValueChange={(val) => updateSettings({ gestureSensitivity: val })}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={colors.border}
                                />
                                <View style={styles.sliderLabels}>
                                    <Text style={[styles.sliderLabelText, { color: colors.textSecondary }]}>Low</Text>
                                    <Text style={[styles.sliderLabelText, { color: colors.textSecondary }]}>High</Text>
                                </View>
                            </View>
                        </View>
                    </SettingSection>

                    <SettingSection title="Account">
                        <TouchableOpacity style={[styles.dangerButton, { padding: spacing.m, backgroundColor: colors.error + '10', marginBottom: spacing.m }]} onPress={handleReset}>
                            <Feather name="trash-2" size={20} color={colors.error} />
                            <Text style={[styles.dangerButtonText, { color: colors.error, marginLeft: spacing.s }]}>Reset App Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.logoutButton, { padding: spacing.m, backgroundColor: colors.background }]} onPress={logout}>
                            <Feather name="log-out" size={20} color={colors.text} />
                            <Text style={[styles.logoutButtonText, { color: colors.text, marginLeft: spacing.s }]}>Log Out</Text>
                        </TouchableOpacity>
                    </SettingSection>
                </View>
            </ScrollView>
            <CustomAlertModal
                visible={modalVisible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                showCancel={modalConfig.showCancel}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                onClose={() => setModalVisible(false)}
            />
        </ScreenWrapper >
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    editButtonText: {
        ...TYPOGRAPHY.button,
    },
    profileCard: {
        borderRadius: 24,
        alignItems: 'center',
        padding: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    avatarContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    profileInfo: {
        alignItems: 'center',
        width: '100%',
    },
    userName: {
        ...TYPOGRAPHY.h2,
        marginBottom: 4,
    },
    userEmail: {
        ...TYPOGRAPHY.body,
        marginBottom: 8,
    },
    userDesc: {
        ...TYPOGRAPHY.caption,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    nameInput: {
        ...TYPOGRAPHY.h2,
        borderBottomWidth: 1,
        paddingBottom: 4,
        marginBottom: 8,
        textAlign: 'center',
        width: '80%',
    },
    descInput: {
        ...TYPOGRAPHY.body,
        borderBottomWidth: 1,
        paddingBottom: 4,
        textAlign: 'center',
        width: '90%',
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderTopWidth: 1,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        ...TYPOGRAPHY.h2,
    },
    statLabel: {
        ...TYPOGRAPHY.caption,
    },
    statDivider: {
        width: 1,
    },
    section: {
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        fontSize: 18,
    },
    sectionContent: {
        borderRadius: 20,
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        ...TYPOGRAPHY.body,
    },
    toggleGroup: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 2,
    },
    toggleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    toggleText: {
        fontSize: 12,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    sliderLabelText: {
        ...TYPOGRAPHY.caption,
        fontSize: 10,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    dangerButtonText: {
        ...TYPOGRAPHY.button,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    logoutButtonText: {
        ...TYPOGRAPHY.button,
    },
});

export default ProfileScreen;
