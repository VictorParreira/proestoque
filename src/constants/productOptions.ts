export const PRODUCT_UNITS = [
  { value: "un", label: "Unidade" },
  { value: "cx", label: "Caixa" },
  { value: "kg", label: "Quilo" },
  { value: "g", label: "Grama" },
  { value: "lt", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "pct", label: "Pacote" },
  { value: "m", label: "Metro" },
] as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[number]["value"];
