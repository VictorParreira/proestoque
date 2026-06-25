import { Stack } from "expo-router";

export default function ProdutosStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        animation: "none",
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Stack.Screen name="novo" />

      <Stack.Screen name="[id]" />
    </Stack>
  );
}