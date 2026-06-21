import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Alert, Keyboard, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "../../../src/components/EmptyState";
import { ProductForm } from "../../../src/components/ProductForm";
import { ProductFormHeader } from "../../../src/components/ProductFormHeader";
import type { ThemeType } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import type { ProdutoFormData } from "../../../src/schemas/produtoSchema";
import { useStableAlert } from "../../../src/hooks/useStableAlert";
import { ProductMovementCard } from "../../../src/components/ProductMovementCard";
import type { MovimentacaoProdutoData } from "../../../src/contexts/ProductsContext";
import { ProductMovementHistoryCard } from "../../../src/components/ProductMovementHistoryCard";
import { useProductMovements } from "../../../src/hooks/useProductMovements";

type ViewMode = "lista" | "grade" | "agrupado";

const isViewMode = (value: unknown): value is ViewMode => {
  return value === "lista" || value === "grade" || value === "agrupado";
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação. Tente novamente.";
};

const MIN_FORM_OPERATION_DURATION_MS = 1200;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export default function EditarProduto() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    viewMode?: string | string[];
  }>();
  const router = useRouter();
  const isUpdatingRef = useRef(false);
const isDeletingRef = useRef(false);
const isMovingRef = useRef(false);
const showAlert = useStableAlert();
  const {
  products,
  updateProduct,
  deleteProduct,
  registrarMovimentacaoProduto,
} = useProducts();
  const { theme } = useAppTheme();
  const [isUpdating, setIsUpdating] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const [isMoving, setIsMoving] = useState(false);

const isScreenBusy = isUpdating || isDeleting || isMoving;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const productId = useMemo(() => {
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const {
  movimentacoes,
  isLoading: isLoadingMovimentacoes,
  error: movimentacoesError,
  carregarMovimentacoes,
} = useProductMovements(productId);

  const returnViewMode = useMemo<ViewMode>(() => {
    const paramViewMode = Array.isArray(params.viewMode)
      ? params.viewMode[0]
      : params.viewMode;

    return isViewMode(paramViewMode) ? paramViewMode : "lista";
  }, [params.viewMode]);

  const goBackToProducts = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

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

const handleRegisterMovement = async (data: MovimentacaoProdutoData) => {
  if (!productId || isScreenBusy || isMovingRef.current) return;

  Keyboard.dismiss();

  isMovingRef.current = true;
  setIsMoving(true);

  const minimumOperationDuration = wait(MIN_FORM_OPERATION_DURATION_MS);

  try {
    await registrarMovimentacaoProduto(productId, data);
await carregarMovimentacoes();
await minimumOperationDuration;
  } catch (error) {
    await minimumOperationDuration;

    showAlert("Erro ao registrar movimentação", getErrorMessage(error));
    throw error;
  } finally {
    isMovingRef.current = false;
    setIsMoving(false);
  }
};

const handleUpdate = async (data: ProdutoFormData) => {
  if (
  !productId ||
  isUpdatingRef.current ||
  isDeletingRef.current ||
  isMovingRef.current
) {
  return;
}

  Keyboard.dismiss();

  isUpdatingRef.current = true;
  setIsUpdating(true);

  const minimumOperationDuration = wait(MIN_FORM_OPERATION_DURATION_MS);

  try {
    await updateProduct(productId, data);
    await minimumOperationDuration;

    goBackToProducts();
  } catch (error) {
    await minimumOperationDuration;

    showAlert("Erro ao atualizar produto", getErrorMessage(error));
  } finally {
    isUpdatingRef.current = false;
    setIsUpdating(false);
  }
};

  const confirmDelete = () => {
    if (!productId) return;

    if (isScreenBusy) return;

Keyboard.dismiss();

    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja remover este produto definitivamente do estoque?",
      [
        { text: "Cancelar", style: "cancel" },
        {
  text: "Excluir",
  style: "destructive",
onPress: async () => {
  if (isDeletingRef.current || isUpdatingRef.current || isMovingRef.current) {
  return;
}

  Keyboard.dismiss();

  isDeletingRef.current = true;
  setIsDeleting(true);

  const minimumOperationDuration = wait(MIN_FORM_OPERATION_DURATION_MS);

  try {
    await deleteProduct(productId);
    await minimumOperationDuration;

    goBackToProducts();
  } catch (error) {
    await minimumOperationDuration;

    showAlert("Erro ao excluir produto", getErrorMessage(error));
  } finally {
    isDeletingRef.current = false;
    setIsDeleting(false);
  }
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
  disabled={isScreenBusy}
  rightAction={{
    icon: "trash-outline",
    accessibilityLabel: `Excluir produto ${product.nome}`,
    onPress: confirmDelete,
    variant: "danger",
    disabled: isScreenBusy,
  }}
/>

      <View style={styles.content}>
<ProductForm
  initialValues={product}
  onSubmit={handleUpdate}
  submitButtonText="Salvar Alterações"
  disabled={isScreenBusy}
  busyLabel={
    isDeleting
      ? "Excluindo produto..."
      : isMoving
        ? "Registrando movimentação..."
        : "Salvando produto..."
  }
headerComponent={
  <>
    <ProductMovementCard
      product={product}
      disabled={isScreenBusy}
      onSubmit={handleRegisterMovement}
      style={styles.movementCard}
    />

    <ProductMovementHistoryCard
      movements={movimentacoes}
      isLoading={isLoadingMovimentacoes}
      error={movimentacoesError}
      onRetry={() => {
        void carregarMovimentacoes();
      }}
      style={styles.historyCard}
    />
  </>
}
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

    movementCard: {
  marginHorizontal: 0,
  marginTop: 0,
  marginBottom: theme.spacing.lg,
},

historyCard: {
  marginBottom: theme.spacing.lg,
},
  });