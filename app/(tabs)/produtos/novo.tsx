import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductForm } from "../../../src/components/ProductForm";
import { ProductFormHeader } from "../../../src/components/ProductFormHeader";
import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import type { ProdutoFormData } from "../../../src/schemas/produtoSchema";

export default function NovoProduto() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const goBackToProducts = () => {
    router.replace("/(tabs)/produtos");
  };

  const handleCreate = async (data: ProdutoFormData) => {
    await addProduct(data);
    goBackToProducts();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ProductFormHeader
        title="Novo produto"
        subtitle="Cadastre as informações principais do item em estoque."
        backAccessibilityLabel="Voltar para produtos"
        onBack={goBackToProducts}
      />

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

    content: {
      flex: 1,
    },
  });
