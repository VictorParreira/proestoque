import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

export type SummaryCardVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

type SummaryCardProps = ViewProps & {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  variant: SummaryCardVariant;
};

const ICON_CONTAINER_SIZE = 32;
const ICON_SIZE = 17;

export function SummaryCard({
  title,
  value,
  icon,
  variant,
  style,
  accessibilityLabel,
  ...rest
}: SummaryCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const colorsByVariant = {
    primary: {
      icon: theme.colors.primary,
      background: theme.colors.primarySubtle,
    },
    success: {
      icon: theme.colors.success,
      background: theme.colors.successSoft,
    },
    warning: {
      icon: theme.colors.warning,
      background: theme.colors.warningSoft,
    },
    error: {
      icon: theme.colors.error,
      background: theme.colors.errorSoft,
    },
    info: {
      icon: theme.colors.info,
      background: theme.colors.infoSoft,
    },
  } satisfies Record<SummaryCardVariant, { icon: string; background: string }>;

  const colors = colorsByVariant[variant];

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel ?? `${title}: ${value}`}
      {...rest}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <View
          style={[styles.iconContainer, { backgroundColor: colors.background }]}
        >
          <Ionicons name={icon} size={ICON_SIZE} color={colors.icon} />
        </View>
      </View>

      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm + theme.spacing.xs,
  borderRadius: theme.borderRadius.lg,
  backgroundColor: theme.colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  shadowColor: theme.shadow.sm.shadowColor,
  shadowOffset: theme.shadow.sm.shadowOffset,
  shadowOpacity: theme.shadow.sm.shadowOpacity,
  shadowRadius: theme.shadow.sm.shadowRadius,
  elevation: theme.shadow.sm.elevation,
},

header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing.sm,
},

title: {
  flex: 1,
  marginTop: theme.spacing.xxs,
  color: theme.colors.textSecondary,
  fontSize: theme.typography.footnote.fontSize,
  lineHeight: theme.typography.footnote.lineHeight,
  fontWeight: "600",
},

iconContainer: {
  width: ICON_CONTAINER_SIZE,
  height: ICON_CONTAINER_SIZE,
  borderRadius: theme.borderRadius.pill,
  justifyContent: "center",
  alignItems: "center",
  marginLeft: theme.spacing.sm,
},

value: {
  color: theme.colors.text,
  fontSize: 24,
  lineHeight: 30,
  fontWeight: "800",
  letterSpacing: -0.45,
},
  });
