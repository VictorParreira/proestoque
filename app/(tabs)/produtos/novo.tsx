import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ProductForm } from "../../../src/components/ProductForm";
import { useProducts } from "../../../src/contexts/ProductsContext";
import { ProdutoFormData } from "../../../src/schemas/produtoSchema";

export default function NovoProduto() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const handleCreate = async (data: ProdutoFormData) => {
    await addProduct(data);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ProductForm
        onSubmit={handleCreate}
        submitButtonText="Adicionar ao Estoque"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
