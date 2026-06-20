import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type AuthBackButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
};

export function AuthBackButton({
  onPress,
  accessibilityLabel = "Voltar",
  disabled = false,
  style,
  buttonStyle,
}: AuthBackButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled, buttonStyle]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },

    button: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    disabled: {
      opacity: theme.opacity.disabled,
    },
  });
