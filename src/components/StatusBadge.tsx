import React, { useMemo } from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type StatusBadgeVariant = "success" | "warning" | "error" | "info" | "primary";

type StatusBadgeProps = ViewProps & {
  label: string;
  variant: StatusBadgeVariant;
};

export function StatusBadge({
  label,
  variant,
  style,
  accessibilityLabel,
  ...rest
}: StatusBadgeProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const colorsByVariant = {
    success: {
      text: theme.colors.success,
      background: theme.colors.successSoft,
    },
    warning: {
      text: theme.colors.warning,
      background: theme.colors.warningSoft,
    },
    error: {
      text: theme.colors.error,
      background: theme.colors.errorSoft,
    },
    info: {
      text: theme.colors.info,
      background: theme.colors.infoSoft,
    },
    primary: {
      text: theme.colors.primary,
      background: theme.colors.primarySubtle,
    },
  } satisfies Record<StatusBadgeVariant, { text: string; background: string }>;

  const colors = colorsByVariant[variant];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `Status: ${label}`}
      {...rest}
    >
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.pill,
    },

    text: {
      fontSize: theme.typography.caption2.fontSize,
      lineHeight: theme.typography.caption2.lineHeight,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.2,
    },
  });
