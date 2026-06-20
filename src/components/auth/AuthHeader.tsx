import React, { useMemo, type ComponentProps } from "react";
import {
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";
import { LogoProEstoque } from "../LogoProEstoque";

type LogoProEstoqueProps = ComponentProps<typeof LogoProEstoque>;

type AuthHeaderProps = {
  title: string;
  description: string;
  logoSize?: LogoProEstoqueProps["size"];
  style?: StyleProp<ViewStyle>;
};

export function AuthHeader({
  title,
  description,
  logoSize = "lg",
  style,
}: AuthHeaderProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <LogoProEstoque size={logoSize} />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.md,
    },

    title: {
      marginTop: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.typography.title3.fontSize,
      lineHeight: theme.typography.title3.lineHeight,
      fontWeight: theme.typography.title3.fontWeight,
      letterSpacing: -0.2,
      textAlign: "center",
    },

    description: {
      marginTop: theme.spacing.xs,
      maxWidth: 300,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "500",
      textAlign: "center",
    },
  });
