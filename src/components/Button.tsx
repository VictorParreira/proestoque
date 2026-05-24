import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type ButtonVariant =
  | "solid"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
}

export function Button({
  title,
  fullWidth,
  loading = false,
  variant = "solid",
  style,
  disabled,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isDisabled = Boolean(disabled || loading);

  const buttonStyleByVariant = {
    solid: styles.buttonSolid,
    outline: styles.buttonOutline,
    secondary: styles.buttonSecondary,
    ghost: styles.buttonGhost,
    destructive: styles.buttonDestructive,
  } satisfies Record<ButtonVariant, object>;

  const textStyleByVariant = {
    solid: styles.textSolid,
    outline: styles.textOutline,
    secondary: styles.textSecondary,
    ghost: styles.textGhost,
    destructive: styles.textDestructive,
  } satisfies Record<ButtonVariant, object>;

  const loaderColorByVariant = {
    solid: theme.colors.primaryContrast,
    outline: theme.colors.primary,
    secondary: theme.colors.text,
    ghost: theme.colors.primary,
    destructive: theme.colors.primaryContrast,
  } satisfies Record<ButtonVariant, string>;

  return (
    <TouchableOpacity
      activeOpacity={0.72}
      style={[
        styles.button,
        buttonStyleByVariant[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={loaderColorByVariant[variant]} />
      ) : (
        <Text style={[styles.text, textStyleByVariant[variant]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    button: {
      minHeight: 56,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
      flexDirection: "row",
    },

    buttonSolid: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 10,
      elevation: 3,
    },

    buttonOutline: {
      backgroundColor: "transparent",
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.primary,
    },

    buttonSecondary: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    buttonGhost: {
      backgroundColor: "transparent",
    },

    buttonDestructive: {
      backgroundColor: theme.colors.error,
      shadowColor: theme.colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 3,
    },

    buttonDisabled: {
      opacity: theme.opacity.disabled,
      shadowOpacity: 0,
      elevation: 0,
    },

    fullWidth: {
      width: "100%",
    },

    text: {
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
      letterSpacing: 0.2,
    },

    textSolid: {
      color: theme.colors.primaryContrast,
    },

    textOutline: {
      color: theme.colors.primary,
    },

    textSecondary: {
      color: theme.colors.text,
    },

    textGhost: {
      color: theme.colors.primary,
    },

    textDestructive: {
      color: theme.colors.primaryContrast,
    },
  });
