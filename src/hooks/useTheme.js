import { useColorScheme } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { COLORS, SPACING } from '../constants/Theme';

export const useTheme = () => {
    const systemScheme = useColorScheme();
    const { settings } = useSettings();

    const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && systemScheme === 'dark');

    const colors = isDark ? COLORS.dark : COLORS.light;

    const getSpacing = () => {
        switch (settings.layout) {
            case 'compact':
                return { ...SPACING, m: 12, l: 16, xl: 24 };
            case 'expanded':
                return { ...SPACING, m: 20, l: 32, xl: 40 };
            default: 
                return SPACING;
        }
    };

    return {
        colors,
        spacing: getSpacing(),
        isDark,
        settings,
    };
};
