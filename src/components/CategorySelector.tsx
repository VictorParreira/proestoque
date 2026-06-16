import { Ionicons } from "@expo/vector-icons";
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
import { CATEGORIAS_MOCK } from "../data/mockData";

type CategorySelectorProps = ViewProps & {
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
};

export function CategorySelector({
  value,
  onChange,
  error,
  style,
  ...rest
}: CategorySelectorProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {CATEGORIAS_MOCK.map((category) => {
          const isSelected = value === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.72}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Categoria ${category.nome}`}
              onPress={() => onChange(category.id)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                error && styles.optionError,
              ]}
            >
              <Ionicons
                name={category.icone}
                size={18}
                color={
                  isSelected ? theme.colors.primary : theme.colors.textSecondary
                }
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {category.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
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
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      gap: theme.spacing.xs,
    },

    optionSelected: {
      backgroundColor: theme.colors.primarySubtle,
      borderColor: theme.colors.primary,
    },

    optionError: {
      borderColor: theme.colors.error,
    },

    optionText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
    },

    optionTextSelected: {
      color: theme.colors.primary,
      fontWeight: "700",
    },

    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },

    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "500",
      marginLeft: theme.spacing.xs,
    },
  });
