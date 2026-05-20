import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Configuracoes() {
  const { user, logout } = useAuth();

  const inicialUsuario = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja encerrar sua sessão no ProEstoque?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicialUsuario}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "Usuário"}</Text>
          <Text style={styles.profileEmail}>
            {user?.email || "usuario@email.com"}
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={22} color="#7c3aed" />
            <Text style={styles.menuItemText}>Notificações</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={22} color="#7c3aed" />
            <Text style={styles.menuItemText}>Ajuda & Suporte</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#7c3aed"
            />
            <Text style={styles.menuItemText}>Privacidade & Segurança</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={22} color="#dc2626" />
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: theme.spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.lg,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  menuContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    paddingVertical: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: "auto",
    marginBottom: theme.spacing.sm,
  },
  logoutButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "bold",
  },
});
