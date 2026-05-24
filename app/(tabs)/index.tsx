import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProducts } from "../../src/contexts/ProductsContext";

import {
  CATEGORIAS_MOCK,
  formatarPreco,
  Produto,
} from "../../src/data/mockData";

export default function HomeScreen() {
  const { user } = useAuth();
  const { products } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const [expandido, setExpandido] = useState(false);

  const alertas = useMemo(() => {
    return products.filter((p) => p.quantidade < p.quantidadeMinima);
  }, [products]);

  const valorTotal = useMemo(() => {
    return products.reduce((total, p) => total + p.quantidade * p.preco, 0);
  }, [products]);

  const cardResumo = [
    {
      id: "total",
      titulo: "Produtos",
      valor: products.length,
      icone: "cube-outline" as const,
      corFundo: "#f5f3ff",
      corIcone: theme.colors.primary,
    },
    {
      id: "alertas",
      titulo: "Alertas",
      valor: alertas.length,
      icone: "alert-circle-outline" as const,
      corFundo: "#fef2f2",
      corIcone: theme.colors.error,
    },
    {
      id: "categorias",
      titulo: "Categorias",
      valor: CATEGORIAS_MOCK.length,
      icone: "grid-outline" as const,
      corFundo: "#eff6ff",
      corIcone: "#2563eb",
    },
    {
      id: "valor",
      titulo: "Em Estoque",
      valor: formatarPreco(valorTotal),
      icone: "cash-outline" as const,
      corFundo: "#ecfdf5",
      corIcone: theme.colors.success,
    },
  ];

  const saudacao = useMemo(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const inicialUsuario = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const dataHoje = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date());

  const alertasExibidos = useMemo(() => {
    return expandido ? alertas : alertas.slice(0, 5);
  }, [alertas, expandido]);

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.saudacaoContainer}>
        <View style={styles.saudacaoTextContainer}>
          <Text style={styles.saudacaoTitulo} numberOfLines={2}>
            {saudacao}, {user?.name || "Visitante"}
          </Text>
          <Text style={styles.saudacaoSub}>
            {dataHoje.charAt(0).toUpperCase() + dataHoje.slice(1)}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicialUsuario}</Text>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cardResumo.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>{card.titulo}</Text>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: card.corFundo },
                ]}
              >
                <Ionicons name={card.icone} size={18} color={card.corIcone} />
              </View>
            </View>

            <Text
              style={styles.cardValor}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              {card.valor}
            </Text>
          </View>
        ))}
      </View>

      {alertas.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons
              name="alert-circle"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.alertTitle}>Estoque Crítico</Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{alertas.length}</Text>
            </View>
          </View>

          <View style={styles.alertList}>
            {alertasExibidos.map((item) => (
              <View key={item.id} style={styles.alertaRow}>
                <Text style={styles.alertaTexto} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={styles.alertaQuantidade}>
                  {item.quantidade} / {item.quantidadeMinima}
                </Text>
              </View>
            ))}
          </View>

          {alertas.length > 5 && (
            <TouchableOpacity
              style={styles.alertToggleBtn}
              activeOpacity={0.7}
              onPress={() => setExpandido(!expandido)}
            >
              <Text style={styles.alertToggleText}>
                {expandido
                  ? "Recolher lista"
                  : `Visualizar todos os ${alertas.length} itens`}
              </Text>
              <Ionicons
                name={expandido ? "chevron-up" : "chevron-down"}
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    let statusCor = theme.colors.success;
    let statusBg = "#d1fae5";
    let statusTexto = "Normal";

    if (item.quantidade === 0) {
      statusCor = theme.colors.error;
      statusBg = "#fee2e2";
      statusTexto = "Vazio";
    } else if (item.quantidade < item.quantidadeMinima) {
      statusCor = theme.colors.warning;
      statusBg = "#fef3c7";
      statusTexto = "Baixo";
    }

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoInfo}>
          {item.foto ? (
            <Image
              source={{ uri: item.foto }}
              style={styles.produtoThumbnail}
            />
          ) : (
            <View style={styles.produtoIcone}>
              <Ionicons name="cube" size={22} color={theme.colors.primary} />
            </View>
          )}

          <View style={styles.produtoTextos}>
            <Text style={styles.produtoNome} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={styles.produtoQtd}>
              {item.quantidade} {item.unidade} • R${" "}
              {item.preco.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: statusBg }]}>
          <Text style={[styles.badgeText, { color: statusCor }]}>
            {statusTexto}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={products.slice(-5).reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { paddingBottom: 24 },

  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },

  saudacaoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  saudacaoTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  saudacaoTitulo: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  saudacaoSub: {
    fontSize: 15,
    color: theme.colors.textLight,
    marginTop: 4,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },

  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  card: {
    width: "48%",
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textLight,
    flex: 1,
    marginTop: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cardValor: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },

  alertCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  alertBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  alertBadgeText: {
    color: theme.colors.error,
    fontWeight: "bold",
    fontSize: 12,
  },
  alertList: { gap: 8 },
  alertaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 12,
  },
  alertaTexto: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginRight: 10,
  },
  alertaQuantidade: {
    color: theme.colors.error,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
  },

  alertToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
    gap: 4,
  },
  alertToggleText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },

  produtoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  produtoInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  produtoThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: theme.colors.background,
  },
  produtoIcone: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  produtoTextos: { flex: 1, paddingRight: 10 },
  produtoNome: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 2,
  },
  produtoQtd: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: "800" },
});
