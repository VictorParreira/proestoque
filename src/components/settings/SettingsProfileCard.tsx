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

const PROFILE_AVATAR_SIZE = 52;
const PROFILE_EDIT_BUTTON_SIZE = 36;
const PROFILE_EDIT_ICON_SIZE = 17;

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
        <Ionicons
  name="pencil"
  size={PROFILE_EDIT_ICON_SIZE}
  color={theme.colors.primary}
/>
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
  padding: theme.spacing.sm + theme.spacing.xs,
  borderRadius: theme.borderRadius.lg,
  marginBottom: theme.spacing.lg,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  shadowColor: theme.shadow.sm.shadowColor,
  shadowOffset: theme.shadow.sm.shadowOffset,
  shadowOpacity: theme.shadow.sm.shadowOpacity,
  shadowRadius: theme.shadow.sm.shadowRadius,
  elevation: theme.shadow.sm.elevation,
},

avatar: {
  width: PROFILE_AVATAR_SIZE,
  height: PROFILE_AVATAR_SIZE,
  borderRadius: theme.borderRadius.pill,
  backgroundColor: theme.colors.primary,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: theme.colors.primary,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 2,
},

avatarText: {
  color: theme.colors.primaryContrast,
  fontSize: theme.typography.title3.fontSize,
  lineHeight: theme.typography.title3.lineHeight,
  fontWeight: "700",
},

info: {
  flex: 1,
  marginLeft: theme.spacing.sm + theme.spacing.xs,
},

name: {
  fontSize: theme.typography.subheadline.fontSize,
  lineHeight: theme.typography.subheadline.lineHeight,
  fontWeight: "800",
  color: theme.colors.text,
  marginBottom: 2,
},

email: {
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  color: theme.colors.textSecondary,
},

editButton: {
  width: PROFILE_EDIT_BUTTON_SIZE,
  height: PROFILE_EDIT_BUTTON_SIZE,
  borderRadius: theme.borderRadius.pill,
  backgroundColor: theme.colors.primarySubtle,
  justifyContent: "center",
  alignItems: "center",
},
  });
