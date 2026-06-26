import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  getStockNotificationsPreferenceAsync,
  setStockNotificationsEnabledAsync,
  syncStockNotificationsAsync,
} from "../../src/services/stockNotifications";
import { BlurView } from "expo-blur";
import { SettingsDivider } from "../../src/components/settings/SettingsDivider";
import { SettingsGroup } from "../../src/components/settings/SettingsGroup";
import { SettingsLogoutButton } from "../../src/components/settings/SettingsLogoutButton";
import { SettingsProfileCard } from "../../src/components/settings/SettingsProfileCard";
import { SettingsRow } from "../../src/components/settings/SettingsRow";
import { SettingsSectionTitle } from "../../src/components/settings/SettingsSectionTitle";
import { ThemePreferenceSelector } from "../../src/components/settings/ThemePreferenceSelector";
import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useProducts } from "../../src/contexts/ProductsContext";

export default function ConfiguracoesScreen() {
  const { user, logout, isSubmitting } = useAuth();
  const { products } = useProducts();
const { preference, setThemePreference, theme, isDark } = useAppTheme();
const insets = useSafeAreaInsets();

const [notificacoes, setNotificacoes] = useState(false);
const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);

const styles = useMemo(
  () => createStyles(theme, isDark, insets.top),
  [theme, isDark, insets.top],
);

useEffect(() => {
  let isMounted = true;

  const loadNotificationPreference = async () => {
    try {
      const storedPreference = await getStockNotificationsPreferenceAsync();

      if (isMounted) {
        setNotificacoes(storedPreference);
      }
    } catch {
      if (isMounted) {
        setNotificacoes(false);
      }
    }
  };

  void loadNotificationPreference();

  return () => {
    isMounted = false;
  };
}, []);

useEffect(() => {
  if (!notificacoes) return;

  void syncStockNotificationsAsync(products);
}, [notificacoes, products]);

  const handleEditProfile = () => {
    Alert.alert(
      "Editar perfil",
      "A edição de perfil será implementada em uma próxima etapa.",
    );
  };

  const handleExportReport = () => {
    Alert.alert(
      "Exportar relatório",
      "A exportação em CSV será implementada em uma próxima etapa.",
    );
  };

  const handleHelpCenter = () => {
    Alert.alert(
      "Central de Ajuda",
      "A central de ajuda será implementada em uma próxima etapa.",
    );
  };

  const handleStockNotificationsChange = useCallback(
  async (enabled: boolean) => {
    if (isUpdatingNotifications) return;

    setIsUpdatingNotifications(true);

    try {
      const nextEnabled = await setStockNotificationsEnabledAsync(enabled);

      setNotificacoes(nextEnabled);

      if (enabled && !nextEnabled) {
        Alert.alert(
          "Permissão necessária",
          "Para receber alertas de estoque crítico, permita notificações nas configurações do sistema.",
        );
        return;
      }

if (nextEnabled) {
  const result = await syncStockNotificationsAsync(products);

  Alert.alert(
    "Notificações ativadas",
    result.scheduled
      ? "Você receberá alertas diários às 09:00 quando houver produtos com estoque crítico."
      : "Você receberá alertas quando houver produtos com estoque crítico.",
  );
}
    } catch {
      setNotificacoes(false);

      Alert.alert(
        "Erro nas notificações",
        "Não foi possível atualizar sua preferência de notificações. Tente novamente.",
      );
    } finally {
      setIsUpdatingNotifications(false);
    }
  },
  [isUpdatingNotifications, products],
);

  const handleLogout = () => {
    if (isSubmitting) return;

    Alert.alert(
      "Sair do aplicativo",
      "Tem certeza que deseja desconectar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            void logout();
          },
        },
      ],
    );
  };

  return (
<SafeAreaView style={styles.container} edges={["left", "right"]}>
  <View pointerEvents="none" style={styles.topBlur}>
    <BlurView
      intensity={Platform.OS === "android" ? 72 : 34}
      tint={
        isDark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterialLight"
      }
      experimentalBlurMethod="dimezisBlurView"
      style={StyleSheet.absoluteFill}
    />

    <View style={styles.topBlurScrim} />
  </View>

  <ScrollView
    contentContainerStyle={styles.scrollContent}
    contentInsetAdjustmentBehavior="never"
    showsVerticalScrollIndicator={false}
  >
    <Text style={styles.titulo}>Configurações</Text>
        <SettingsProfileCard
          name={user?.name}
          email={user?.email}
          onEdit={handleEditProfile}
        />

        <SettingsSectionTitle>Preferências</SettingsSectionTitle>

        <SettingsGroup>
          <SettingsRow
            icon="notifications-outline"
            label="Notificações de Estoque"
            rightContent={
              <Switch
  value={notificacoes}
  onValueChange={(enabled) => {
    void handleStockNotificationsChange(enabled);
  }}
  disabled={isUpdatingNotifications}
  trackColor={{
    false: theme.colors.surfaceTertiary,
    true: theme.colors.primary,
  }}
  thumbColor={theme.colors.primaryContrast}
  ios_backgroundColor={theme.colors.surfaceTertiary}
/>
            }
          />

          <SettingsDivider />

          <ThemePreferenceSelector
            value={preference}
            onChange={setThemePreference}
          />
        </SettingsGroup>

        <SettingsSectionTitle>Dados e Suporte</SettingsSectionTitle>

        <SettingsGroup>
          <SettingsRow
            icon="cloud-download-outline"
            label="Exportar Relatório (CSV)"
            accessibilityLabel="Exportar relatório em CSV"
            showChevron
            onPress={handleExportReport}
          />

          <SettingsDivider />

          <SettingsRow
            icon="help-buoy-outline"
            label="Central de Ajuda"
            accessibilityLabel="Abrir central de ajuda"
            showChevron
            onPress={handleHelpCenter}
          />
        </SettingsGroup>

        <SettingsGroup style={styles.dangerGroup}>
          <SettingsLogoutButton
            onPress={handleLogout}
            disabled={isSubmitting}
          />
        </SettingsGroup>

        <Text style={styles.versionText}>ProEstoque v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (
  theme: ThemeType,
  isDark: boolean,
  topInset: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

topBlur: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: topInset + theme.spacing.xs,
  zIndex: 10,
  overflow: "hidden",
},

topBlurScrim: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.background,
  opacity: isDark ? 0.18 : 0.28,
},

titulo: {
  fontSize: 30,
  lineHeight: 36,
  fontWeight: theme.typography.largeTitle.fontWeight,
  color: theme.colors.text,
  letterSpacing: -0.6,
  marginBottom: theme.spacing.sm + theme.spacing.xs,
},

scrollContent: {
  paddingHorizontal: theme.spacing.lg,
  paddingTop: topInset + theme.spacing.sm + theme.spacing.xs,
  paddingBottom: theme.spacing["3xl"],
},

    dangerGroup: {
      marginTop: theme.spacing.sm,
    },

    versionText: {
      textAlign: "center",
      marginTop: theme.spacing.xl,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });
