import React, { useMemo } from "react";
import { StyleSheet, Text, type TextProps } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type SettingsSectionTitleProps = TextProps & {
  children: string;
};

export function SettingsSectionTitle({
  children,
  style,
  ...rest
}: SettingsSectionTitleProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    title: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },
  });
