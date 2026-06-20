import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type SettingsProfileCardProps = {
  name?: string | null;
  email?: string | null;
  onEdit?: () => void;
};

export function SettingsProfileCard({
  name,
  email,
  onEdit,
}: SettingsProfileCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const displayName = name || "Visitante";
  const displayEmail = email || "usuario@email.com";
  const userInitial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{userInitial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>

        <Text style={styles.email} numberOfLines={1}>
          {displayEmail}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel="Editar perfil"
        onPress={onEdit}
      >
        <Ionicons name="pencil" size={18} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 3,
    },

    avatarText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: "700",
    },

    info: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    name: {
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
      color: theme.colors.text,
      marginBottom: 2,
    },

    email: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
    },

    editButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
    },
  });
