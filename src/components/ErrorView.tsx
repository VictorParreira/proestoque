import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type ErrorViewProps = ViewProps & {
  title?: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorView({
  title = "Não foi possível carregar os dados",
  description,
  retryLabel = "Tentar novamente",
  onRetry,
  style,
  accessibilityLabel,
  ...rest
}: ErrorViewProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel ?? title}
      {...rest}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name="cloud-offline-outline" size={36} color={theme.colors.error} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      {onRetry && (
        <TouchableOpacity
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={theme.colors.primaryContrast}
          />

          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
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
      backgroundColor: theme.colors.errorSoft,
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

    retryButton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.lg,
      gap: theme.spacing.xs,
    },

    retryButtonText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
    },
  });