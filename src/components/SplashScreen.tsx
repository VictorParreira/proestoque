import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { LogoProEstoque } from "./LogoProEstoque";

const { width } = Dimensions.get("window");

type SplashScreenProps = {
  onComplete?: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  }, [progress, onComplete]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LogoProEstoque size="lg" />
        <Text style={styles.tagline}>Gestão de estoque inteligente</Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>

        <Text style={styles.loadingText}>Verificando sessão...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    transform: [{ translateY: -20 }],
  },
  appName: {
    marginTop: theme.spacing.lg,
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    width: width * 0.6,
    alignItems: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: "500",
  },
});
