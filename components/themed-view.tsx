import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "background" | "surface" | "elevated" | "secondary";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "background",
  ...otherProps
}: ThemedViewProps) {
  const colorNameByVariant = {
    background: "background",
    surface: "surface",
    elevated: "surfaceElevated",
    secondary: "surfaceSecondary",
  } as const;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorNameByVariant[variant],
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
