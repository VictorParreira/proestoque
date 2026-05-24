import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SplashScreen } from "../src/components/SplashScreen";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { ProductsProvider } from "../src/contexts/ProductsContext";

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [isSplashAnimationDone, setIsSplashAnimationDone] = useState(false);

  useEffect(() => {
    if (isLoading || !isSplashAnimationDone) return;

    setTimeout(() => {
      const inAuthGroup = segments[0] === "(auth)";

      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/login");
      } else if (isAuthenticated && inAuthGroup) {
        router.replace("/(tabs)");
      }
    }, 1);
  }, [isLoading, isAuthenticated, segments, router, isSplashAnimationDone]);

  const isAppReady = !isLoading && isSplashAnimationDone;

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

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <StatusBar style="auto" />
        <NavigationGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="index" />
          </Stack>
        </NavigationGuard>
      </ProductsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },
});
