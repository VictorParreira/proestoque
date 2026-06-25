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
  showChevron?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

const SETTINGS_ROW_ICON_CONTAINER_SIZE = 32;
const SETTINGS_ROW_ICON_SIZE = 18;
const SETTINGS_ROW_CHEVRON_SIZE = 18;

export function SettingsRow({
  icon,
  label,
  description,
  rightContent,
  showChevron = false,
  onPress,
  accessibilityLabel,
}: SettingsRowProps) {
  const { theme } = useAppTheme();

  const trailingContent =
    rightContent ??
    (showChevron ? (
      <Ionicons
  name="chevron-forward"
  size={SETTINGS_ROW_CHEVRON_SIZE}
  color={theme.colors.textTertiary}
/>
    ) : null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const content = (
    <>
      <View style={styles.iconBackground}>
        <Ionicons
  name={icon}
  size={SETTINGS_ROW_ICON_SIZE}
  color={theme.colors.textSecondary}
/>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      {trailingContent ? (
        <View style={styles.rightContent}>{trailingContent}</View>
      ) : null}
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
  minHeight: 56,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
},

iconBackground: {
  width: SETTINGS_ROW_ICON_CONTAINER_SIZE,
  height: SETTINGS_ROW_ICON_CONTAINER_SIZE,
  borderRadius: theme.borderRadius.sm,
  backgroundColor: theme.colors.surfaceSecondary,
  justifyContent: "center",
  alignItems: "center",
  marginRight: theme.spacing.sm + theme.spacing.xs,
},

label: {
  fontSize: theme.typography.subheadline.fontSize,
  lineHeight: theme.typography.subheadline.lineHeight,
  fontWeight: "700",
  color: theme.colors.text,
},

description: {
  marginTop: theme.spacing.xxs,
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  color: theme.colors.textSecondary,
},

rightContent: {
  minHeight: 36,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: theme.spacing.sm,
},

    textContainer: {
      flex: 1,
    },
  });
