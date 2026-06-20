import type { ProdutoFormData } from "../schemas/produtoSchema";

export const PRODUCT_FORM_DEFAULT_VALUES: ProdutoFormData = {
  nome: "",
  categoriaId: "cat_1",
  quantidade: 0,
  quantidadeMinima: 0,
  preco: 0,
  unidade: "un",
  foto: undefined,
};
