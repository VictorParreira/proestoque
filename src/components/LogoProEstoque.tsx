import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function LogoProEstoque({ size = "md" }: LogoProps) {
  const dimensions = {
    sm: { icon: 24, text: 16 },
    md: { icon: 40, text: 24 },
    lg: { icon: 56, text: 32 },
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { borderRadius: dimensions[size].icon / 2.5 },
        ]}
      >
        <Ionicons
          name="cube-outline"
          size={dimensions[size].icon}
          color={theme.colors.background}
        />
      </View>
      <Text style={[styles.text, { fontSize: dimensions[size].text }]}>
        ProEstoque
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  iconContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
  },
  text: {
    fontWeight: "bold",
    color: theme.colors.text,
  },
});
