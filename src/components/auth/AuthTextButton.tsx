import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type AuthTextButtonProps = Omit<TouchableOpacityProps, "children"> & {
  title: string;
};

export function AuthTextButton({
  title,
  style,
  disabled,
  accessibilityLabel,
  ...rest
}: AuthTextButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      disabled={disabled}
      activeOpacity={0.72}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      {...rest}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    button: {
      alignSelf: "flex-end",
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
    },

    text: {
      color: theme.colors.primary,
      fontWeight: "700",
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
    },

    disabled: {
      opacity: theme.opacity.disabled,
    },
  });
