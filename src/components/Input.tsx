import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

interface InputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export function Input({
  icon,
  error,
  isPassword = false,
  onFocus,
  onBlur,
  style,
  editable = true,
  placeholderTextColor,
  secureTextEntry,
  accessibilityLabel,
  ...rest
}: InputProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const isDisabled = editable === false;

  const iconColor = hasError
    ? theme.colors.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.textSecondary;

  const resolvedSecureTextEntry = isPassword
    ? !isPasswordVisible
    : secureTextEntry;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          isDisabled && styles.inputDisabled,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={iconColor}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={
            placeholderTextColor ?? theme.colors.placeholder
          }
          secureTextEntry={resolvedSecureTextEntry}
          editable={editable}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.primary}
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{
            disabled: isDisabled,
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((current) => !current)}
            hitSlop={{
              top: theme.hitSlop.md,
              bottom: theme.hitSlop.md,
              left: theme.hitSlop.md,
              right: theme.hitSlop.md,
            }}
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
            }
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={theme.colors.error}
          />

          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md + theme.spacing.xs,
    },

    inputContainer: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
    },

    inputFocused: {
      borderColor: theme.colors.inputBorderFocused,
      backgroundColor: theme.colors.surfaceElevated,
    },

    inputError: {
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.errorSoft,
    },

    inputDisabled: {
      opacity: theme.opacity.disabled,
      backgroundColor: theme.colors.inputBackgroundDisabled,
    },

    icon: {
      marginRight: theme.spacing.sm + theme.spacing.xs,
    },

    input: {
      flex: 1,
      minHeight: 56,
      color: theme.colors.text,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: theme.typography.callout.fontWeight,
      paddingVertical: 0,
    },

    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },

    errorText: {
      flex: 1,
      color: theme.colors.error,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
  });
