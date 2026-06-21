import { z } from "zod";

import { PRODUCT_UNITS, type ProductUnit } from "../constants/productOptions";

const productUnitValues = PRODUCT_UNITS.map((unit) => unit.value) as [
  ProductUnit,
  ...ProductUnit[],
];

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(80, "O nome deve ter no máximo 80 caracteres"),

  categoriaId: z.string().trim().min(1, "A categoria é obrigatória"),

  quantidade: z
    .number()
    .int("A quantidade deve ser um número inteiro")
    .min(0, "A quantidade não pode ser negativa"),

  quantidadeMinima: z
    .number()
    .int("A quantidade mínima deve ser um número inteiro")
    .min(0, "A quantidade mínima não pode ser negativa"),

  preco: z
    .number()
    .min(0, "O preço não pode ser negativo")
    .max(999999.99, "O preço deve ser menor que R$ 1.000.000,00"),

  unidade: z.enum(productUnitValues, {
    message: "Selecione uma unidade válida",
  }),

  foto: z.string().trim().nullable().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
