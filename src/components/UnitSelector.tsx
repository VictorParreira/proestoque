import React, { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

const UNIT_OPTIONS = [
  { value: "un", label: "Unidade" },
  { value: "cx", label: "Caixa" },
  { value: "kg", label: "Quilo" },
  { value: "g", label: "Grama" },
  { value: "lt", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "pct", label: "Pacote" },
  { value: "m", label: "Metro" },
] as const;

type UnitValue = (typeof UNIT_OPTIONS)[number]["value"];

type UnitSelectorProps = ViewProps & {
  value: string;
  onChange: (value: UnitValue) => void;
  error?: string;
};

export function UnitSelector({
  value,
  onChange,
  error,
  style,
  ...rest
}: UnitSelectorProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {UNIT_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.72}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Unidade ${option.label}`}
              onPress={() => onChange(option.value)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                error && styles.optionError,
              ]}
            >
              <Text style={[styles.value, isSelected && styles.valueSelected]}>
                {option.value}
              </Text>

              <Text
                numberOfLines={1}
                style={[styles.label, isSelected && styles.labelSelected]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sm,
    },

    content: {
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.lg,
    },

    option: {
      minWidth: 88,
      minHeight: 56,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    optionSelected: {
      backgroundColor: theme.colors.primarySubtle,
      borderColor: theme.colors.primary,
    },

    optionError: {
      borderColor: theme.colors.error,
    },

    value: {
      color: theme.colors.text,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "800",
      textTransform: "uppercase",
    },

    valueSelected: {
      color: theme.colors.primary,
    },

    label: {
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "600",
    },

    labelSelected: {
      color: theme.colors.primary,
      fontWeight: "700",
    },

    errorText: {
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
      color: theme.colors.error,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "500",
    },
  });
