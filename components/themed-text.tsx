import { StyleSheet, Text, type TextProps } from "react-native";

import { useAppTheme, useThemeColor } from "@/hooks/use-theme-color";
import type { ThemeType } from "@/src/constants/theme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    type === "link" ? "primary" : "text",
  );

  return (
    <Text
      style={[
        { color },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "defaultSemiBold" && styles.defaultSemiBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    default: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      fontWeight: theme.typography.body.fontWeight,
    },

    defaultSemiBold: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      fontWeight: "600",
    },

    title: {
      fontSize: theme.typography.largeTitle.fontSize,
      lineHeight: theme.typography.largeTitle.lineHeight,
      fontWeight: theme.typography.largeTitle.fontWeight,
      letterSpacing: -0.7,
    },

    subtitle: {
      fontSize: theme.typography.title3.fontSize,
      lineHeight: theme.typography.title3.lineHeight,
      fontWeight: theme.typography.title3.fontWeight,
      letterSpacing: -0.2,
    },

    link: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      fontWeight: "700",
    },
  });
