import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { ProdutoFormData, produtoSchema } from "../schemas/produtoSchema";
import { Button } from "./Button";
import { ImagePickerField } from "./ImagePickerField";
import { Input } from "./Input";

type ProductFormProps = {
  initialValues?: ProdutoFormData;
  onSubmit: (data: ProdutoFormData) => void;
  submitButtonText: string;
};

export function ProductForm({
  initialValues,
  onSubmit,
  submitButtonText,
}: ProductFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: initialValues || {
      nome: "",
      categoriaId: "cat_1",
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      unidade: "un",
    },
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Foto do Produto</Text>
        <Controller
          control={control}
          name="foto"
          render={({ field: { onChange, value } }) => (
            <ImagePickerField
              value={value}
              onChange={onChange}
              error={errors.foto?.message}
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Produto</Text>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <Input
              icon="cube-outline"
              placeholder="Ex: Teclado Mecânico"
              value={value}
              onChangeText={onChange}
              error={errors.nome?.message}
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>ID da Categoria</Text>
        <Controller
          control={control}
          name="categoriaId"
          render={({ field: { onChange, value } }) => (
            <Input
              icon="grid-outline"
              placeholder="Ex: cat_1"
              value={value}
              onChangeText={onChange}
              error={errors.categoriaId?.message}
            />
          )}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Quantidade</Text>
          <Controller
            control={control}
            name="quantidade"
            render={({ field: { onChange, value } }) => (
              <Input
                icon="layers-outline"
                placeholder="0"
                keyboardType="numeric"
                value={value === 0 ? "" : String(value)}
                onChangeText={(val) => {
                  const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
                  onChange(isNaN(num) ? 0 : num);
                }}
                error={errors.quantidade?.message}
              />
            )}
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Qtd. Mínima</Text>
          <Controller
            control={control}
            name="quantidadeMinima"
            render={({ field: { onChange, value } }) => (
              <Input
                icon="alert-circle-outline"
                placeholder="0"
                keyboardType="numeric"
                value={value === 0 ? "" : String(value)}
                onChangeText={(val) => {
                  const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
                  onChange(isNaN(num) ? 0 : num);
                }}
                error={errors.quantidadeMinima?.message}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Preço</Text>
          <Controller
            control={control}
            name="preco"
            render={({ field: { onChange, value } }) => (
              <Input
                icon="cash-outline"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={value === 0 ? "" : String(value)}
                onChangeText={(val) => {
                  const formatado = val.replace(/,/g, ".");
                  const num = parseFloat(formatado);
                  onChange(isNaN(num) ? 0 : num);
                }}
                error={errors.preco?.message}
              />
            )}
          />
        </View>

        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Unidade</Text>
          <Controller
            control={control}
            name="unidade"
            render={({ field: { onChange, value } }) => (
              <Input
                icon="scale-outline"
                placeholder="Ex: un, kg, cx"
                value={value}
                onChangeText={onChange}
                error={errors.unidade?.message}
              />
            )}
          />
        </View>
      </View>

      <Button
        title={submitButtonText}
        onPress={handleSubmit(onSubmit)}
        fullWidth
        loading={isSubmitting}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg, paddingBottom: 40 },
  formGroup: { marginBottom: theme.spacing.sm },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  submitBtn: { marginTop: theme.spacing.lg },
});
