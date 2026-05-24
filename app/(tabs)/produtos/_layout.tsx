import { Stack } from "expo-router";
import { theme } from "../../../src/constants/theme";

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Lista de Produtos", headerShown: false }}
      />
      <Stack.Screen
        name="novo"
        options={{ title: "Novo Produto", presentation: "modal" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Editar Produto", presentation: "modal" }}
      />
    </Stack>
  );
}
