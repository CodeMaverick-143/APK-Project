export const COLORS = {
    light: {
        primary: '#6366F1', // Indigo 500
        secondary: '#10B981', // Emerald 500
        background: '#F3F4F6', // Gray 100
        surface: 'rgba(255, 255, 255, 0.65)', // Glassy white
        text: '#1F2937', // Gray 800
        textSecondary: '#4B5563', // Gray 600
        border: 'rgba(255, 255, 255, 0.4)',
        error: '#EF4444', // Red 500
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
        accent: '#8B5CF6', // Violet
        gradient: ['#E0E7FF', '#F3E8FF', '#FCE7F3'], // Pastel gradient
    },
    dark: {
        primary: '#818CF8', // Indigo 400
        secondary: '#34D399', // Emerald 400
        background: '#111827', // Gray 900
        surface: 'rgba(31, 41, 55, 0.6)', // Glassy dark
        text: '#F9FAFB', // Gray 50
        textSecondary: '#D1D5DB', // Gray 300
        border: 'rgba(255, 255, 255, 0.1)',
        error: '#F87171', // Red 400
        success: '#34D399',
        warning: '#FBBF24',
        info: '#60A5FA',
        accent: '#A78BFA', // Violet
        gradient: ['#0F172A', '#1E1B4B', '#312E81'], // Aurora dark gradient
    }
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const TYPOGRAPHY = {
    h1: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '600', letterSpacing: -0.5 },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '400', color: '#6B7280' },
    button: { fontSize: 16, fontWeight: '600' },
};

export const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 4,
    },
    large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },
    glow: {
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    }
};

export const GLASS = {
    intensity: 80,
    borderRadius: 24,
    borderWidth: 1,
};
