import React, { useMemo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type SettingsGroupProps = ViewProps;

export function SettingsGroup({
  children,
  style,
  ...rest
}: SettingsGroupProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.group, style]} {...rest}>
      {children}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    group: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      overflow: "hidden",
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },
  });
