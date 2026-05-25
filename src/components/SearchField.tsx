import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    type StyleProp,
    type TextInputProps,
    type ViewStyle,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type SearchFieldProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "style"
> & {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SearchField({
  value,
  onChangeText,
  onClear,
  placeholder = "Buscar...",
  accessibilityLabel = "Campo de busca",
  style,
  ...rest
}: SearchFieldProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const shouldShowClearButton = value.length > 0 && Boolean(onClear);

  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search-outline"
        size={22}
        color={theme.colors.textSecondary}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={theme.colors.primary}
        cursorColor={theme.colors.primary}
        accessibilityLabel={accessibilityLabel}
        {...rest}
      />

      {shouldShowClearButton && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{
            top: theme.hitSlop.md,
            bottom: theme.hitSlop.md,
            left: theme.hitSlop.md,
            right: theme.hitSlop.md,
          }}
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 56,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.inputBorder,
    },

    input: {
      flex: 1,
      marginLeft: theme.spacing.sm + theme.spacing.xs,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      color: theme.colors.text,
      paddingVertical: 0,
    },
  });
