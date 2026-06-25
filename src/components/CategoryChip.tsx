import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type CategoryChipProps = Omit<TouchableOpacityProps, "children"> & {
  label: string;
  selected?: boolean;
};

export function CategoryChip({
  label,
  selected = false,
  style,
  accessibilityLabel,
  ...rest
}: CategoryChipProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      activeOpacity={0.72}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? `Categoria ${label}`}
      style={[styles.container, selected && styles.containerSelected, style]}
      {...rest}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
  minHeight: 36,
  justifyContent: "center",
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.xs,
  borderRadius: theme.borderRadius.pill,
  backgroundColor: theme.colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
},

    containerSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    text: {
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  color: theme.colors.textSecondary,
  fontWeight: "600",
},

    textSelected: {
  color: theme.colors.primaryContrast,
  fontWeight: "700",
},
  });
