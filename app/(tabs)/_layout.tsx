import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { AppleLiquidTabBar } from "../../src/components/navigation/AppleLiquidTabBar";
import { useAppTheme } from "../../src/contexts/ThemeContext";

export default function TabsLayout() {
  const { theme, isDark } = useAppTheme();

  return (
    <>
      <StatusBar
        animated
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.colors.background}
      />

      <Tabs
        tabBar={(props) => <AppleLiquidTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarAccessibilityLabel: "Ir para Início",
          }}
        />

        <Tabs.Screen
          name="produtos"
          options={{
            title: "Produtos",
            tabBarAccessibilityLabel: "Ir para Produtos",
          }}
        />

        <Tabs.Screen
          name="configuracoes"
          options={{
            title: "Ajustes",
            tabBarAccessibilityLabel: "Ir para Ajustes",
          }}
        />
      </Tabs>
    </>
  );
}
