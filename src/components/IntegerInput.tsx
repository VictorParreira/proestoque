import { useMemo, type ComponentProps } from "react";

import { Input } from "./Input";

type InputProps = ComponentProps<typeof Input>;

type IntegerInputProps = Omit<
  InputProps,
  "value" | "onChangeText" | "keyboardType"
> & {
  value: number;
  onChangeValue: (value: number) => void;
  emptyWhenZero?: boolean;
};

function parseIntegerInput(text: string) {
  const digitsOnly = text.replace(/\D/g, "");

  if (!digitsOnly) {
    return 0;
  }

  return Number.parseInt(digitsOnly, 10);
}

export function IntegerInput({
  value,
  onChangeValue,
  emptyWhenZero = true,
  ...rest
}: IntegerInputProps) {
  const displayValue = useMemo(() => {
    if (emptyWhenZero && value === 0) {
      return "";
    }

    return String(value);
  }, [emptyWhenZero, value]);

  return (
    <Input
      {...rest}
      value={displayValue}
      keyboardType="numeric"
      onChangeText={(text) => {
        onChangeValue(parseIntegerInput(text));
      }}
    />
  );
}
