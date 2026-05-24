import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  useAppTheme,
  type ThemePreference,
} from "../../src/contexts/ThemeContext";

const THEME_OPTIONS: Array<{
  label: string;
  value: ThemePreference;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { label: "Sistema", value: "system", icon: "phone-portrait-outline" },
  { label: "Claro", value: "light", icon: "sunny-outline" },
  { label: "Escuro", value: "dark", icon: "moon-outline" },
];

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const { preference, setThemePreference, theme } = useAppTheme();

  const [notificacoes, setNotificacoes] = useState(true);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleLogout = () => {
    Alert.alert(
      "Sair do aplicativo",
      "Tem certeza que deseja desconectar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: logout,
        },
      ],
    );
  };

  const handleThemePreferenceChange = (nextPreference: ThemePreference) => {
    setThemePreference(nextPreference);
  };

  const inicialUsuario = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicialUsuario}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || "Visitante"}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || "usuario@email.com"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <Ionicons name="pencil" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Preferências</Text>

        <View style={styles.settingsGroup}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsIconBg}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
            </View>

            <Text style={styles.settingsLabel}>Notificações de Estoque</Text>

            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
              trackColor={{
                false: theme.colors.surfaceTertiary,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.primaryContrast}
              ios_backgroundColor={theme.colors.surfaceTertiary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.themeSection}>
            <View style={styles.themeHeader}>
              <View style={styles.settingsIconBg}>
                <Ionicons
                  name="contrast-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </View>

              <View style={styles.themeHeaderText}>
                <Text style={styles.settingsLabel}>Aparência</Text>
                <Text style={styles.settingsDescription}>
                  Escolha como o ProEstoque deve adaptar a interface.
                </Text>
              </View>
            </View>

            <View style={styles.themeOptions}>
              {THEME_OPTIONS.map((option) => {
                const isSelected = preference === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.themeOption,
                      isSelected && styles.themeOptionSelected,
                    ]}
                    activeOpacity={0.72}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Tema ${option.label}`}
                    onPress={() => handleThemePreferenceChange(option.value)}
                  >
                    <Ionicons
                      name={option.icon}
                      size={18}
                      color={
                        isSelected
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />

                    <Text
                      style={[
                        styles.themeOptionText,
                        isSelected && styles.themeOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dados e Suporte</Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.72}
            accessibilityRole="button"
          >
            <View style={styles.settingsIconBg}>
              <Ionicons
                name="cloud-download-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
            </View>

            <Text style={styles.settingsLabel}>Exportar Relatório (CSV)</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.72}
            accessibilityRole="button"
          >
            <View style={styles.settingsIconBg}>
              <Ionicons
                name="help-buoy-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
            </View>

            <Text style={styles.settingsLabel}>Central de Ajuda</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerGroup}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.72}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={theme.colors.error}
            />

            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>ProEstoque v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },

    titulo: {
      fontSize: theme.typography.largeTitle.fontSize,
      lineHeight: theme.typography.largeTitle.lineHeight,
      fontWeight: theme.typography.largeTitle.fontWeight,
      color: theme.colors.text,
      letterSpacing: -0.7,
    },

    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing["3xl"],
    },

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 3,
    },

    avatarText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: "700",
    },

    profileInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    profileName: {
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
      color: theme.colors.text,
      marginBottom: 2,
    },

    profileEmail: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
    },

    editButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },

    settingsGroup: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg + theme.spacing.xs,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      overflow: "hidden",
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    settingsRow: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
    },

    settingsIconBg: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surfaceSecondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.sm + theme.spacing.xs,
    },

    settingsLabel: {
      flex: 1,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "600",
      color: theme.colors.text,
    },

    settingsDescription: {
      marginTop: 2,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.separator,
      marginLeft: 64,
    },

    themeSection: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },

    themeHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },

    themeHeaderText: {
      flex: 1,
    },

    themeOptions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },

    themeOption: {
      flex: 1,
      minHeight: 76,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    themeOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySubtle,
    },

    themeOptionText: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },

    themeOptionTextSelected: {
      color: theme.colors.primary,
    },

    dangerGroup: {
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      overflow: "hidden",
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    logoutButton: {
      minHeight: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },

    logoutText: {
      marginLeft: theme.spacing.sm,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
      color: theme.colors.error,
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
