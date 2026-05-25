import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type EmptyStateProps = ViewProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

export function EmptyState({
  icon = "cube-outline",
  title,
  description,
  style,
  accessibilityLabel,
  ...rest
}: EmptyStateProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel ?? title}
      {...rest}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={36} color={theme.colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.xl,
    },

    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },

    title: {
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },

    description: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      textAlign: "center",
    },
  });
