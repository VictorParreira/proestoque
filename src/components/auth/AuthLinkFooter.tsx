import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewProps,
} from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type AuthLinkFooterProps = ViewProps & {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function AuthLinkFooter({
  text,
  linkText,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  ...rest
}: AuthLinkFooterProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <Text style={styles.text}>{text} </Text>

      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? linkText}
      >
        <Text style={[styles.link, disabled && styles.disabled]}>
          {linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.md,
    },

    text: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "500",
    },

    link: {
      color: theme.colors.primary,
      fontWeight: "800",
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
    },

    disabled: {
      opacity: theme.opacity.disabled,
    },
  });
