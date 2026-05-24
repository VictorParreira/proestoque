import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const dimensions = {
  sm: { icon: 20, container: 40, text: 20, radius: 12, marginBottom: 10 },
  md: { icon: 32, container: 64, text: 32, radius: 20, marginBottom: 16 },
  lg: { icon: 48, container: 96, text: 42, radius: 28, marginBottom: 18 },
} as const;

export function LogoProEstoque({ size = "md" }: LogoProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const dim = dimensions[size];

  return (
    <View style={styles.container} accessibilityRole="image">
      <View
        style={[
          styles.iconContainer,
          {
            width: dim.container,
            height: dim.container,
            borderRadius: dim.radius,
            marginBottom: dim.marginBottom,
          },
        ]}
      >
        <Ionicons
          name="cube-outline"
          size={dim.icon}
          color={theme.colors.primaryContrast}
        />
      </View>

      <Text
        style={[
          styles.text,
          {
            fontSize: dim.text,
            lineHeight: Math.round(dim.text * 1.12),
          },
        ]}
      >
        Pro<Text style={styles.textHighlight}>Estoque</Text>
      </Text>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },

    iconContainer: {
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 16,
      elevation: 6,
    },

    text: {
      fontWeight: "800",
      color: theme.colors.primary,
      letterSpacing: -0.6,
    },

    textHighlight: {
      color: theme.colors.text,
    },
  });
