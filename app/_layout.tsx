import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { SplashScreen } from "../src/components/SplashScreen";
import type { ThemeType } from "../src/constants/theme";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { ProductsProvider } from "../src/contexts/ProductsContext";
import { ThemeProvider, useAppTheme } from "../src/contexts/ThemeContext";
import { configureStockNotificationHandler } from "../src/services/stockNotifications";

configureStockNotificationHandler();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { isRestoringSession, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isSplashAnimationDone, setIsSplashAnimationDone] = useState(false);

  useEffect(() => {
    if (isRestoringSession || !isSplashAnimationDone) return;

    const redirectTimeout = setTimeout(() => {
      const inAuthGroup = segments[0] === "(auth)";

      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      if (isAuthenticated && inAuthGroup) {
        router.replace("/(tabs)");
      }
    }, 1);

    return () => clearTimeout(redirectTimeout);
  }, [
    isRestoringSession,
    isAuthenticated,
    segments,
    router,
    isSplashAnimationDone,
  ]);

  const isAppReady = !isRestoringSession && isSplashAnimationDone;

  return (
    <View style={styles.container}>
      {children}

      {!isAppReady && (
        <View style={styles.splashOverlay}>
          <SplashScreen onComplete={() => setIsSplashAnimationDone(true)} />
        </View>
      )}
    </View>
  );
}

function AppNavigator() {
  const { isDark, theme } = useAppTheme();

  return (
    <>
      <StatusBar
        animated
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.colors.background}
      />

      <NavigationGuard>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Stack.Screen name="(auth)" />
<Stack.Screen name="(tabs)" />

<Stack.Screen
  name="produtos"
  options={{
    presentation: "transparentModal",
    animation: "none",
    contentStyle: {
      backgroundColor: "transparent",
    },
  }}
/>

<Stack.Screen name="index" />
        </Stack>
      </NavigationGuard>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <AppNavigator />
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    splashOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999,
      elevation: 999,
    },
  });
