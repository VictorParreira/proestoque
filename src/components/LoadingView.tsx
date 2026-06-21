import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type LoadingViewProps = ViewProps & {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function LoadingView({
  title = "Carregando...",
  description = "Buscando informações atualizadas.",
  icon = "cloud-download-outline",
  style,
  accessibilityLabel,
  ...rest
}: LoadingViewProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? title}
      {...rest}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={34} color={theme.colors.primary} />
      </View>

      <ActivityIndicator color={theme.colors.primary} />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing["3xl"],
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
      marginTop: theme.spacing.md,
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