import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type HeaderAction = {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
  variant?: "primary" | "danger";
  disabled?: boolean;
};

type ProductFormHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  backAccessibilityLabel?: string;
  rightAction?: HeaderAction;
  disabled?: boolean;
};

export function ProductFormHeader({
  title,
  subtitle,
  onBack,
  backAccessibilityLabel = "Voltar",
  rightAction,
  disabled = false,
}: ProductFormHeaderProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isDangerAction = rightAction?.variant === "danger";
  const isRightActionDisabled = disabled || rightAction?.disabled;

  return (
    <View style={styles.header}>
      <TouchableOpacity
  style={[styles.backButton, disabled && styles.buttonDisabled]}
  activeOpacity={0.72}
  accessibilityRole="button"
  accessibilityLabel={backAccessibilityLabel}
  accessibilityState={{ disabled }}
  disabled={disabled}
  onPress={onBack}
>
  <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
</TouchableOpacity>

      <View style={styles.headerTextContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightAction ? (
        <TouchableOpacity
  style={[
    styles.actionButton,
    isDangerAction && styles.actionButtonDanger,
    isRightActionDisabled && styles.buttonDisabled,
  ]}
  activeOpacity={0.72}
  accessibilityRole="button"
  accessibilityLabel={rightAction.accessibilityLabel}
  accessibilityState={{ disabled: isRightActionDisabled }}
  disabled={isRightActionDisabled}
  onPress={rightAction.onPress}
>
  <Ionicons
    name={rightAction.icon}
    size={22}
    color={isDangerAction ? theme.colors.error : theme.colors.primary}
  />
</TouchableOpacity>
      ) : null}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.primarySubtle,
    },

    headerTextContainer: {
      flex: 1,
      minHeight: 40,
      justifyContent: "center",
    },

    title: {
      color: theme.colors.text,
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: theme.typography.title2.fontWeight,
      letterSpacing: -0.3,
    },

    subtitle: {
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "500",
    },

    actionButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: theme.spacing.sm,
      backgroundColor: theme.colors.primarySubtle,
    },

    actionButtonDanger: {
      backgroundColor: theme.colors.errorSoft,
    },

    buttonDisabled: {
  opacity: theme.opacity.disabled,
},
  });
