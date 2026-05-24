import { type PropsWithChildren, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { ThemeType } from "@/src/constants/theme";
import { useAppTheme } from "@/src/contexts/ThemeContext";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ThemedView variant="surface" style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{
          expanded: isOpen,
        }}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme.colors.textSecondary}
          style={{
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          }}
        />

        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
      </TouchableOpacity>

      {isOpen && (
        <ThemedView variant="surface" style={styles.content}>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.md,
    },

    heading: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    title: {
      flex: 1,
    },

    content: {
      marginTop: theme.spacing.sm,
      marginLeft: theme.spacing.lg,
    },
  });
