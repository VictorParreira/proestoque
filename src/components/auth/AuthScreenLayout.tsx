import React, { useMemo, type ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type AuthScreenLayoutProps = {
  children: ReactNode;
  topSlot?: ReactNode;
  centerContent?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function AuthScreenLayout({
  children,
  topSlot,
  centerContent = false,
  contentContainerStyle,
}: AuthScreenLayoutProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {topSlot}

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            centerContent && styles.centeredContent,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    keyboardView: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },

    centeredContent: {
      justifyContent: "center",
    },
  });
