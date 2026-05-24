/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "@/hooks/use-color-scheme";
import { themes, type ThemeMode, type ThemeType } from "@/src/constants/theme";

type ThemeColorName = keyof ThemeType["colors"];

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const themeMode: ThemeMode = colorScheme === "dark" ? "dark" : "light";

  return {
    mode: themeMode,
    isDark: themeMode === "dark",
    isLight: themeMode === "light",
    theme: themes[themeMode],
    colors: themes[themeMode].colors,
  };
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName,
) {
  const { mode, colors } = useAppTheme();
  const colorFromProps = props[mode];

  return colorFromProps ?? colors[colorName];
}
