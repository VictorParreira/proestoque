import React, { useMemo, type ComponentProps } from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";
import { Input } from "../Input";

type InputProps = ComponentProps<typeof Input>;

type AuthFormFieldProps = ViewProps &
  InputProps & {
    label: string;
  };

export function AuthFormField({
  label,
  style,
  ...inputProps
}: AuthFormFieldProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <Input {...inputProps} />
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginBottom: 0,
    },

    label: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
  });
