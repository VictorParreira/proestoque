import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductForm } from "../../../src/components/ProductForm";
import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import type { ProdutoFormData } from "../../../src/schemas/produtoSchema";

export default function NovoProduto() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCreate = async (data: ProdutoFormData) => {
    await addProduct(data);
    router.replace("/(tabs)/produtos");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityLabel="Voltar para produtos"
          onPress={() => router.replace("/(tabs)/produtos")}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Novo produto</Text>
          <Text style={styles.subtitle}>
            Cadastre as informações principais do item em estoque.
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <ProductForm
          onSubmit={handleCreate}
          submitButtonText="Adicionar ao Estoque"
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.primarySubtle,
    },

    headerTextContainer: {
      flex: 1,
    },

    title: {
      color: theme.colors.text,
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: theme.typography.title2.fontWeight,
      letterSpacing: -0.3,
    },

    subtitle: {
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "500",
    },

    content: {
      flex: 1,
    },
  });
