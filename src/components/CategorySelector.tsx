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
import { useCategorias } from "../hooks/useCategorias";

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

  const {
    categorias,
    isLoading,
    error: categoriasError,
    carregarCategorias,
  } = useCategorias();

  const hasError = Boolean(error || categoriasError);

  return (
    <View style={[styles.container, style]} {...rest}>
      {isLoading ? (
  <View style={styles.loadingContainer}>
    <Ionicons
      name="hourglass-outline"
      size={18}
      color={theme.colors.textSecondary}
    />

    <Text style={styles.loadingText}>Carregando categorias...</Text>
  </View>
) : categoriasError ? (
        <View style={styles.errorStateContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={theme.colors.error}
          />

          <Text style={styles.errorText}>{categoriasError}</Text>

          <TouchableOpacity
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar categorias novamente"
            onPress={() => {
              void carregarCategorias();
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {categorias.map((category) => {
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
                  hasError && styles.optionError,
                ]}
              >
                <Ionicons
                  name={category.icone}
                  size={18}
                  color={
                    isSelected
                      ? theme.colors.primary
                      : theme.colors.textSecondary
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
      )}

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

loadingContainer: {
  height: 56,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: theme.spacing.md,
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  gap: theme.spacing.sm,
},

loadingText: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.footnote.fontSize,
  lineHeight: theme.typography.footnote.fontSize,
  fontWeight: "600",
  includeFontPadding: false,
  textAlignVertical: "center",
},

errorStateContainer: {
  minHeight: 56,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  gap: theme.spacing.sm,
},

    retryButton: {
      minHeight: 32,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
    },

    retryButtonText: {
      color: theme.colors.primary,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "700",
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