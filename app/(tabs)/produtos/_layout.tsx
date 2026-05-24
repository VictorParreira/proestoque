import { Stack } from "expo-router";

import { useAppTheme } from "../../../src/contexts/ThemeContext";

export default function ProdutosLayout() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="novo"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
