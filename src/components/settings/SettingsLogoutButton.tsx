import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type SettingsLogoutButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function SettingsLogoutButton({
  onPress,
  disabled = false,
}: SettingsLogoutButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.72}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
    >
      <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />

      <Text style={styles.text}>Sair da Conta</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    button: {
      minHeight: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },

    text: {
      marginLeft: theme.spacing.sm,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
      color: theme.colors.error,
    },

    disabled: {
      opacity: theme.opacity.disabled,
    },
  });
