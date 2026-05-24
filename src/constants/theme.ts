const sharedDimensions = {
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 40,
    "3xl": 48,
  },

  borderRadius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    pill: 9999,
  },

  borderWidth: {
    hairline: 1,
    sm: 1,
    md: 2,
  },

  typography: {
    largeTitle: {
      fontSize: 34,
      lineHeight: 41,
      fontWeight: "700",
    },
    title1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "700",
    },
    title2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: "700",
    },
    title3: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: "600",
    },
    headline: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "600",
    },
    body: {
      fontSize: 17,
      lineHeight: 24,
      fontWeight: "400",
    },
    callout: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "400",
    },
    subheadline: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "400",
    },
    footnote: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "400",
    },
    caption1: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "400",
    },
    caption2: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: "400",
    },
  },

  opacity: {
    disabled: 0.45,
    pressed: 0.72,
    subtle: 0.68,
    muted: 0.52,
    overlay: 0.36,
  },

  hitSlop: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;

export const lightTheme = {
  colors: {
    /**
     * Brand
     * Mantém a identidade atual, mas preparada para estados de interação.
     */
    primary: "#6B4EFF",
    primaryHover: "#6046E8",
    primaryPressed: "#553ED1",
    primarySoft: "rgba(107, 78, 255, 0.12)",
    primarySubtle: "rgba(107, 78, 255, 0.08)",
    primaryContrast: "#FFFFFF",

    /**
     * Backgrounds
     * Inspirado na separação de system/grouped backgrounds do iOS.
     */
    background: "#F2F2F7",
    backgroundSecondary: "#FFFFFF",
    backgroundTertiary: "#E5E5EA",
    backgroundElevated: "#FFFFFF",
    backgroundInset: "#E5E5EA",

    /**
     * Surfaces
     * Mantém `surface` e `surfaceSecondary` para compatibilidade.
     */
    surface: "#FFFFFF",
    surfaceSecondary: "#E5E5EA",
    surfaceTertiary: "#D1D1D6",
    surfaceElevated: "#FFFFFF",
    surfaceOverlay: "rgba(255, 255, 255, 0.86)",

    /**
     * Typography
     * Mantém `text` e `textLight` para compatibilidade.
     */
    text: "#000000",
    textSecondary: "rgba(60, 60, 67, 0.72)",
    textTertiary: "rgba(60, 60, 67, 0.48)",
    textLight: "#8A8A8E",
    textMuted: "rgba(60, 60, 67, 0.36)",
    textInverse: "#FFFFFF",

    /**
     * Separators / Borders
     */
    border: "rgba(60, 60, 67, 0.15)",
    borderStrong: "rgba(60, 60, 67, 0.28)",
    separator: "rgba(60, 60, 67, 0.18)",
    separatorOpaque: "#C6C6C8",

    /**
     * Inputs
     */
    inputBackground: "#FFFFFF",
    inputBackgroundDisabled: "#F2F2F7",
    inputBorder: "rgba(60, 60, 67, 0.18)",
    inputBorderFocused: "#6B4EFF",
    placeholder: "rgba(60, 60, 67, 0.42)",

    /**
     * Semantic Status
     */
    error: "#FF3B30",
    errorSoft: "rgba(255, 59, 48, 0.12)",
    warning: "#FF9500",
    warningSoft: "rgba(255, 149, 0, 0.14)",
    success: "#34C759",
    successSoft: "rgba(52, 199, 89, 0.14)",
    info: "#007AFF",
    infoSoft: "rgba(0, 122, 255, 0.12)",

    /**
     * Interaction Layers
     */
    pressed: "rgba(0, 0, 0, 0.06)",
    hovered: "rgba(0, 0, 0, 0.04)",
    selected: "rgba(107, 78, 255, 0.12)",
    focused: "rgba(107, 78, 255, 0.22)",
    disabled: "rgba(60, 60, 67, 0.18)",

    /**
     * Overlays / Scrims
     */
    overlay: "rgba(0, 0, 0, 0.24)",
    scrim: "rgba(0, 0, 0, 0.36)",
    materialThin: "rgba(255, 255, 255, 0.72)",
    materialRegular: "rgba(255, 255, 255, 0.84)",
    materialThick: "rgba(255, 255, 255, 0.92)",
  },

  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 6,
    },
  },

  ...sharedDimensions,
} as const;

export const darkTheme = {
  colors: {
    /**
     * Brand
     * Ajustada para preservar contraste e vibração no dark mode.
     */
    primary: "#8B74FF",
    primaryHover: "#9A86FF",
    primaryPressed: "#7762E8",
    primarySoft: "rgba(139, 116, 255, 0.18)",
    primarySubtle: "rgba(139, 116, 255, 0.12)",
    primaryContrast: "#FFFFFF",

    /**
     * Backgrounds
     * Base escura + superfícies elevadas para profundidade visual.
     */
    background: "#000000",
    backgroundSecondary: "#1C1C1E",
    backgroundTertiary: "#2C2C2E",
    backgroundElevated: "#1C1C1E",
    backgroundInset: "#000000",

    /**
     * Surfaces
     * Mantém `surface` e `surfaceSecondary` para compatibilidade.
     */
    surface: "#1C1C1E",
    surfaceSecondary: "#2C2C2E",
    surfaceTertiary: "#3A3A3C",
    surfaceElevated: "#2C2C2E",
    surfaceOverlay: "rgba(28, 28, 30, 0.88)",

    /**
     * Typography
     * Mantém `text` e `textLight` para compatibilidade.
     */
    text: "#FFFFFF",
    textSecondary: "rgba(235, 235, 245, 0.72)",
    textTertiary: "rgba(235, 235, 245, 0.48)",
    textLight: "rgba(235, 235, 245, 0.6)",
    textMuted: "rgba(235, 235, 245, 0.36)",
    textInverse: "#000000",

    /**
     * Separators / Borders
     */
    border: "rgba(84, 84, 88, 0.4)",
    borderStrong: "rgba(99, 99, 102, 0.72)",
    separator: "rgba(84, 84, 88, 0.48)",
    separatorOpaque: "#38383A",

    /**
     * Inputs
     */
    inputBackground: "#1C1C1E",
    inputBackgroundDisabled: "#2C2C2E",
    inputBorder: "rgba(84, 84, 88, 0.48)",
    inputBorderFocused: "#8B74FF",
    placeholder: "rgba(235, 235, 245, 0.42)",

    /**
     * Semantic Status
     */
    error: "#FF453A",
    errorSoft: "rgba(255, 69, 58, 0.18)",
    warning: "#FF9F0A",
    warningSoft: "rgba(255, 159, 10, 0.18)",
    success: "#30D158",
    successSoft: "rgba(48, 209, 88, 0.18)",
    info: "#0A84FF",
    infoSoft: "rgba(10, 132, 255, 0.18)",

    /**
     * Interaction Layers
     */
    pressed: "rgba(255, 255, 255, 0.10)",
    hovered: "rgba(255, 255, 255, 0.07)",
    selected: "rgba(139, 116, 255, 0.18)",
    focused: "rgba(139, 116, 255, 0.28)",
    disabled: "rgba(235, 235, 245, 0.18)",

    /**
     * Overlays / Scrims
     */
    overlay: "rgba(0, 0, 0, 0.48)",
    scrim: "rgba(0, 0, 0, 0.64)",
    materialThin: "rgba(28, 28, 30, 0.72)",
    materialRegular: "rgba(28, 28, 30, 0.84)",
    materialThick: "rgba(28, 28, 30, 0.92)",
  },

  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.16,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 10,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.28,
      shadowRadius: 24,
      elevation: 6,
    },
  },

  ...sharedDimensions,
} as const;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

/**
 * Mantido para compatibilidade com arquivos que ainda importam `theme`.
 * Durante a próxima fase, vamos substituir usos diretos por um hook de tema ativo.
 */
export const theme = lightTheme;

export type ThemeMode = keyof typeof themes;
export type ThemeType = (typeof themes)[ThemeMode];
