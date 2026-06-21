import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductForm } from "../../../src/components/ProductForm";
import { ProductFormHeader } from "../../../src/components/ProductFormHeader";
import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import type { ProdutoFormData } from "../../../src/schemas/produtoSchema";
import { useStableAlert } from "../../../src/hooks/useStableAlert";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível salvar o produto. Tente novamente.";
};

const MIN_FORM_OPERATION_DURATION_MS = 1200;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export default function NovoProduto() {
  const router = useRouter();
  const isCreatingRef = useRef(false);
const showAlert = useStableAlert();
  const { addProduct } = useProducts();
  const { theme } = useAppTheme();
  const [isCreating, setIsCreating] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const goBackToProducts = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/produtos");
  };

const handleCreate = async (data: ProdutoFormData) => {
  if (isCreatingRef.current) return;

  isCreatingRef.current = true;
  setIsCreating(true);

  const minimumOperationDuration = wait(MIN_FORM_OPERATION_DURATION_MS);

  try {
    await addProduct(data);
    await minimumOperationDuration;

    goBackToProducts();
  } catch (error) {
    await minimumOperationDuration;

    showAlert("Erro ao criar produto", getErrorMessage(error));
  } finally {
    isCreatingRef.current = false;
    setIsCreating(false);
  }
};

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ProductFormHeader
  title="Novo produto"
  subtitle="Cadastre as informações principais do item em estoque."
  backAccessibilityLabel="Voltar para produtos"
  onBack={goBackToProducts}
  disabled={isCreating}
/>

      <View style={styles.content}>
        <ProductForm
  onSubmit={handleCreate}
  submitButtonText="Adicionar ao Estoque"
  disabled={isCreating}
  busyLabel="Salvando produto..."
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