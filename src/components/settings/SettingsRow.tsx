import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type SettingsRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  rightContent?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function SettingsRow({
  icon,
  label,
  description,
  rightContent,
  onPress,
  accessibilityLabel,
}: SettingsRowProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const content = (
    <>
      <View style={styles.iconBackground}>
        <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      {rightContent}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    row: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
    },

    iconBackground: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surfaceSecondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.sm + theme.spacing.xs,
    },

    textContainer: {
      flex: 1,
    },

    label: {
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "600",
      color: theme.colors.text,
    },

    description: {
      marginTop: 2,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
    },
  });
