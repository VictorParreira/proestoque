import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

export type ViewModeSelectorOption<TValue extends string> = {
  value: TValue;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

type ViewModeSelectorProps<TValue extends string> = {
  value: TValue;
  options: ViewModeSelectorOption<TValue>[];
  onChange: (value: TValue) => void;
  style?: StyleProp<ViewStyle>;
};

export function ViewModeSelector<TValue extends string>({
  value,
  options,
  onChange,
  style,
}: ViewModeSelectorProps<TValue>) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel={`Visualização em ${option.label}`}
            accessibilityState={{ selected: isActive }}
            style={[styles.button, isActive && styles.buttonActive]}
          >
            <Ionicons
              name={option.icon}
              size={18}
              color={
                isActive
                  ? theme.colors.primaryContrast
                  : theme.colors.textSecondary
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.xs,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    button: {
      minWidth: 36,
      minHeight: 32,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.xs,
      alignItems: "center",
      justifyContent: "center",
    },

    buttonActive: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },
  });
