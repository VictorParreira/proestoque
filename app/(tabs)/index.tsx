import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá, {user?.name || "Visitante"} 👋
          </Text>
          <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.mainCardLabel}>Total em produtos</Text>
          <Text style={styles.mainCardValue}>247</Text>
        </View>

        <View style={styles.rowCards}>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Categorias</Text>
            <Text style={styles.smallCardValue}>12</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.smallCardLabel}>Alertas</Text>
            <Text
              style={[styles.smallCardValue, { color: theme.colors.error }]}
            >
              5
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>— preenchido na próxima aula —</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  mainCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  mainCardLabel: {
    color: "#E0D4FF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  mainCardValue: {
    color: theme.colors.background,
    fontSize: 36,
    fontWeight: "bold",
  },
  rowCards: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  smallCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Efeito de sombra leve
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  smallCardLabel: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  smallCardValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.textLight,
    fontStyle: "italic",
  },
});
