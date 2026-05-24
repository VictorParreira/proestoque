/**
 * Compatibility layer for Expo template imports.
 *
 * The canonical theme lives in:
 * src/constants/theme.ts
 *
 * Keep this file only for legacy/template imports such as:
 * import { Colors, Fonts } from "@/constants/theme";
 */

import { Platform } from "react-native";

import { themes } from "@/src/constants/theme";

export const Colors = {
  light: {
    text: themes.light.colors.text,
    background: themes.light.colors.background,
    tint: themes.light.colors.primary,
    icon: themes.light.colors.textSecondary,
    tabIconDefault: themes.light.colors.textTertiary,
    tabIconSelected: themes.light.colors.primary,
  },
  dark: {
    text: themes.dark.colors.text,
    background: themes.dark.colors.background,
    tint: themes.dark.colors.primary,
    icon: themes.dark.colors.textSecondary,
    tabIconDefault: themes.dark.colors.textTertiary,
    tabIconSelected: themes.dark.colors.primary,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
