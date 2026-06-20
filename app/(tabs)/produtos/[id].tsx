import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "../../../src/components/EmptyState";
import { ProductForm } from "../../../src/components/ProductForm";
import { ProductFormHeader } from "../../../src/components/ProductFormHeader";
import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import type { ProdutoFormData } from "../../../src/schemas/produtoSchema";

type ViewMode = "lista" | "grade" | "agrupado";

const isViewMode = (value: unknown): value is ViewMode => {
  return value === "lista" || value === "grade" || value === "agrupado";
};

export default function EditarProduto() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    viewMode?: string | string[];
  }>();
  const router = useRouter();
  const { products, updateProduct, deleteProduct } = useProducts();
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const productId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const returnViewMode = useMemo<ViewMode>(() => {
    const paramViewMode = Array.isArray(params.viewMode)
      ? params.viewMode[0]
      : params.viewMode;

    return isViewMode(paramViewMode) ? paramViewMode : "lista";
  }, [params.viewMode]);

  const goBackToProducts = () => {
    router.replace({
      pathname: "/(tabs)/produtos",
      params: {
        viewMode: returnViewMode,
      },
    });
  };

  const product = useMemo(() => {
    if (!productId) return undefined;

    return products.find((item) => item.id === productId);
  }, [productId, products]);

  const handleUpdate = async (data: ProdutoFormData) => {
    if (!productId) return;

    await updateProduct(productId, data);
    goBackToProducts();
  };

  const confirmDelete = () => {
    if (!productId) return;

    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja remover este produto definitivamente do estoque?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(productId);
            goBackToProducts();
          },
        },
      ],
    );
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ProductFormHeader
          title="Produto não encontrado"
          subtitle="O item selecionado não está mais disponível."
          backAccessibilityLabel="Voltar para produtos"
          onBack={goBackToProducts}
        />

        <EmptyState
          icon="cube-outline"
          title="Nada para editar"
          description="Volte para a lista de produtos e selecione outro item."
          style={styles.emptyState}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ProductFormHeader
        title="Editar produto"
        subtitle={product.nome}
        backAccessibilityLabel="Voltar para produtos"
        onBack={goBackToProducts}
        rightAction={{
          icon: "trash-outline",
          accessibilityLabel: `Excluir produto ${product.nome}`,
          onPress: confirmDelete,
          variant: "danger",
        }}
      />

      <View style={styles.content}>
        <ProductForm
          initialValues={product}
          onSubmit={handleUpdate}
          submitButtonText="Salvar Alterações"
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

    emptyState: {
      flex: 1,
      justifyContent: "center",
      paddingBottom: theme.spacing["3xl"],
    },
  });
