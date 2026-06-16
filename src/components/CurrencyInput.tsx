import { useMemo, type ComponentProps } from "react";

import { Input } from "./Input";

type InputProps = ComponentProps<typeof Input>;

type CurrencyInputProps = Omit<
  InputProps,
  "value" | "onChangeText" | "keyboardType" | "placeholder"
> & {
  value: number;
  onChangeValue: (value: number) => void;
  placeholder?: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrencyInput(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return currencyFormatter.format(value);
}

function parseCurrencyInput(text: string) {
  const digitsOnly = text.replace(/\D/g, "");

  if (!digitsOnly) {
    return 0;
  }

  return Number(digitsOnly) / 100;
}

export function CurrencyInput({
  value,
  onChangeValue,
  placeholder = "R$ 0,00",
  ...rest
}: CurrencyInputProps) {
  const formattedValue = useMemo(() => {
    return formatCurrencyInput(value);
  }, [value]);

  return (
    <Input
      {...rest}
      value={formattedValue}
      placeholder={placeholder}
      keyboardType="numeric"
      onChangeText={(text) => {
        onChangeValue(parseCurrencyInput(text));
      }}
    />
  );
}
