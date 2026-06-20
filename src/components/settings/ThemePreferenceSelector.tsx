import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme, type ThemePreference } from "../../contexts/ThemeContext";
import { SettingsRow } from "./SettingsRow";

const THEME_OPTIONS: {
  label: string;
  value: ThemePreference;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "Sistema", value: "system", icon: "phone-portrait-outline" },
  { label: "Claro", value: "light", icon: "sunny-outline" },
  { label: "Escuro", value: "dark", icon: "moon-outline" },
];

type ThemePreferenceSelectorProps = {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
};

export function ThemePreferenceSelector({
  value,
  onChange,
}: ThemePreferenceSelectorProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <SettingsRow
        icon="contrast-outline"
        label="Aparência"
        description="Escolha como o ProEstoque deve adaptar a interface."
      />

      <View style={styles.options}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              activeOpacity={0.72}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Tema ${option.label}`}
              onPress={() => onChange(option.value)}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={
                  isSelected ? theme.colors.primary : theme.colors.textSecondary
                }
              />

              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.md,
    },

    options: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },

    option: {
      flex: 1,
      minHeight: 76,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    optionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySubtle,
    },

    optionText: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },

    optionTextSelected: {
      color: theme.colors.primary,
    },
  });
