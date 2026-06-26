import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { Produto } from "../domain/produtos";

const STOCK_NOTIFICATIONS_STORAGE_KEY =
  "@ProEstoque:stockNotificationsEnabled";

const STOCK_NOTIFICATION_IDENTIFIER_STORAGE_KEY =
  "@ProEstoque:stockNotificationIdentifier";

const STOCK_NOTIFICATION_CHANNEL_ID = "stock-alerts";
const STOCK_NOTIFICATION_DATA_TYPE = "stock-critical-alert";
const STOCK_IMMEDIATE_NOTIFICATION_DATA_TYPE =
  "stock-critical-immediate-alert";

const DEFAULT_STOCK_NOTIFICATION_HOUR = 9;
const DEFAULT_STOCK_NOTIFICATION_MINUTE = 0;

type StockNotificationSyncResult = {
  scheduled: boolean;
  criticalCount: number;
};

export function configureStockNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function ensureStockNotificationChannelAsync() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(
    STOCK_NOTIFICATION_CHANNEL_ID,
    {
      name: "Alertas de estoque",
      description: "Notificações sobre produtos com estoque crítico.",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6B4EFF",
      sound: "default",
    },
  );
}

export async function getStockNotificationsPreferenceAsync() {
  const storedValue = await AsyncStorage.getItem(
    STOCK_NOTIFICATIONS_STORAGE_KEY,
  );

  return storedValue === "true";
}

export async function saveStockNotificationsPreferenceAsync(enabled: boolean) {
  await AsyncStorage.setItem(
    STOCK_NOTIFICATIONS_STORAGE_KEY,
    String(enabled),
  );
}

export async function requestStockNotificationPermissionAsync() {
  await ensureStockNotificationChannelAsync();

  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.status === "granted") {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();

  return requestedPermission.status === "granted";
}

function getCriticalStockProducts(products: Produto[]) {
  return products.filter((product) => {
    return product.quantidade < product.quantidadeMinima;
  });
}

function getStockNotificationBody(criticalProducts: Produto[]) {
  const criticalCount = criticalProducts.length;

  if (criticalCount === 1) {
    const [product] = criticalProducts;

    return `${product.nome} está com ${product.quantidade} ${product.unidade}, abaixo do mínimo definido.`;
  }

  const firstProducts = criticalProducts
    .slice(0, 3)
    .map((product) => product.nome)
    .join(", ");

  const remainingCount = criticalCount - 3;

  if (remainingCount > 0) {
    return `${criticalCount} produtos estão com estoque crítico: ${firstProducts} e mais ${remainingCount}.`;
  }

  return `${criticalCount} produtos estão com estoque crítico: ${firstProducts}.`;
}

async function saveScheduledStockNotificationIdentifierAsync(
  identifier: string | null,
) {
  if (!identifier) {
    await AsyncStorage.removeItem(STOCK_NOTIFICATION_IDENTIFIER_STORAGE_KEY);
    return;
  }

  await AsyncStorage.setItem(
    STOCK_NOTIFICATION_IDENTIFIER_STORAGE_KEY,
    identifier,
  );
}

async function getScheduledStockNotificationIdentifierAsync() {
  return AsyncStorage.getItem(STOCK_NOTIFICATION_IDENTIFIER_STORAGE_KEY);
}

export async function cancelScheduledStockNotificationsAsync() {
  const storedIdentifier =
    await getScheduledStockNotificationIdentifierAsync();

  if (storedIdentifier) {
    await Notifications.cancelScheduledNotificationAsync(storedIdentifier);
  }

  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  const stockNotifications = scheduledNotifications.filter((notification) => {
    return notification.content.data?.type === STOCK_NOTIFICATION_DATA_TYPE;
  });

  await Promise.all(
    stockNotifications.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );

  await saveScheduledStockNotificationIdentifierAsync(null);
}

export async function scheduleDailyStockNotificationAsync(
  products: Produto[],
  hour = DEFAULT_STOCK_NOTIFICATION_HOUR,
  minute = DEFAULT_STOCK_NOTIFICATION_MINUTE,
): Promise<StockNotificationSyncResult> {
  await ensureStockNotificationChannelAsync();

  const criticalProducts = getCriticalStockProducts(products);
  const criticalCount = criticalProducts.length;

  await cancelScheduledStockNotificationsAsync();

  if (criticalCount === 0) {
    return {
      scheduled: false,
      criticalCount,
    };
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Estoque crítico",
      body: getStockNotificationBody(criticalProducts),
      sound: "default",
      data: {
        type: STOCK_NOTIFICATION_DATA_TYPE,
        criticalCount,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: STOCK_NOTIFICATION_CHANNEL_ID,
    },
  });

  await saveScheduledStockNotificationIdentifierAsync(identifier);

  return {
    scheduled: true,
    criticalCount,
  };
}

export async function syncStockNotificationsAsync(
  products: Produto[],
): Promise<StockNotificationSyncResult> {
  const preferenceEnabled = await getStockNotificationsPreferenceAsync();

  if (!preferenceEnabled) {
    await cancelScheduledStockNotificationsAsync();

    return {
      scheduled: false,
      criticalCount: 0,
    };
  }

  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.status !== "granted") {
    await saveStockNotificationsPreferenceAsync(false);
    await cancelScheduledStockNotificationsAsync();

    return {
      scheduled: false,
      criticalCount: 0,
    };
  }

  return scheduleDailyStockNotificationAsync(products);
}

export async function setStockNotificationsEnabledAsync(enabled: boolean) {
  if (!enabled) {
    await cancelScheduledStockNotificationsAsync();
    await saveStockNotificationsPreferenceAsync(false);
    return false;
  }

  const hasPermission = await requestStockNotificationPermissionAsync();

  if (!hasPermission) {
    await cancelScheduledStockNotificationsAsync();
    await saveStockNotificationsPreferenceAsync(false);
    return false;
  }

  await saveStockNotificationsPreferenceAsync(true);
  return true;
}

export async function scheduleImmediateCriticalStockNotificationAsync(
  product: Produto,
) {
  const preferenceEnabled = await getStockNotificationsPreferenceAsync();

  if (!preferenceEnabled) {
    return false;
  }

  await ensureStockNotificationChannelAsync();

  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.status !== "granted") {
    await saveStockNotificationsPreferenceAsync(false);
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Produto em estoque crítico",
      body: `${product.nome} entrou em estoque crítico: ${product.quantidade} ${product.unidade} disponíveis, abaixo do mínimo de ${product.quantidadeMinima}.`,
      sound: "default",
      data: {
        type: STOCK_IMMEDIATE_NOTIFICATION_DATA_TYPE,
        productId: product.id,
      },
    },
    trigger: null,
  });

  return true;
}