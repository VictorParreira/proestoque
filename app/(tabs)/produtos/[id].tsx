import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { ProductForm } from "../../../src/components/ProductForm";
import { theme } from "../../../src/constants/theme";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { ProdutoFormData } from "../../../src/schemas/produtoSchema";

export default function EditarProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products, updateProduct, deleteProduct } = useProducts();

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [id, products],
  );

  const handleUpdate = async (data: ProdutoFormData) => {
    await updateProduct(id, data);
    router.back();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Excluir Produto",
      "Tem certeza que deseja remover este produto definitivamente do estoque?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(id);
            router.back();
          },
        },
      ],
    );
  };

  if (!product) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={confirmDelete}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={24} color="#dc2626" />
            </TouchableOpacity>
          ),
        }}
      />

      <ProductForm
        initialValues={product}
        onSubmit={handleUpdate}
        submitButtonText="Salvar Alterações"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  deleteBtn: {
    padding: theme.spacing.xs,
    marginRight: 4,
  },
});
