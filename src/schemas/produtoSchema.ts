import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  categoriaId: z.string().min(1, "A categoria é obrigatória"),
  quantidade: z.number().min(0, "A quantidade não pode ser negativa"),
  quantidadeMinima: z
    .number()
    .min(0, "A quantidade mínima não pode ser negativa"),
  preco: z.number().min(0, "O preço não pode ser negativo"),
  unidade: z.string().min(1, "A unidade é obrigatória"),
  foto: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
