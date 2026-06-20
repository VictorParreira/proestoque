import React, { useMemo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type AuthCardProps = ViewProps;

export function AuthCard({ children, style, ...rest }: AuthCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.md.shadowColor,
      shadowOffset: theme.shadow.md.shadowOffset,
      shadowOpacity: theme.shadow.md.shadowOpacity,
      shadowRadius: theme.shadow.md.shadowRadius,
      elevation: theme.shadow.md.elevation,
    },
  });
