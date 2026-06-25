import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    LayoutChangeEvent,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

type RouteConfig = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  index: {
    label: "Início",
    icon: "home-outline",
    activeIcon: "home",
  },
  produtos: {
    label: "Produtos",
    icon: "cube-outline",
    activeIcon: "cube",
  },
  configuracoes: {
    label: "Ajustes",
    icon: "settings-outline",
    activeIcon: "settings",
  },
};

const TAB_BAR_PADDING = 4;
const TAB_GAP = 4;
const TAB_BAR_HEIGHT = 62;
const TAB_ITEM_HEIGHT = TAB_BAR_HEIGHT - TAB_BAR_PADDING * 2;
const ACCESSORY_SIZE = 62;
const TAB_ICON_SIZE = 21;
const ACCESSORY_ICON_SIZE = 28;

function LiquidGlassBackground({
  isDark,
  borderRadius,
}: {
  isDark: boolean;
  borderRadius: number;
}) {
  return (
    <BlurView
      intensity={Platform.OS === "android" ? 96 : 46}
      tint={
        isDark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterialLight"
      }
      experimentalBlurMethod="dimezisBlurView"
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius,
          overflow: "hidden",
        },
      ]}
    />
  );
}

export function AppleLiquidTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppTheme();

  const styles = useMemo(
    () => createStyles(theme, isDark, insets.bottom),
    [theme, isDark, insets.bottom],
  );

  const routes = useMemo(
    () => state.routes.filter((route) => ROUTE_CONFIG[route.name]),
    [state.routes],
  );

  const activeRouteKey = state.routes[state.index]?.key;
  const activeVisualIndex = Math.max(
    0,
    routes.findIndex((route) => route.key === activeRouteKey),
  );

  const [tabsWidth, setTabsWidth] = useState(0);

  const selectionProgress = useRef(
    new Animated.Value(activeVisualIndex),
  ).current;
  const selectionPress = useRef(new Animated.Value(0)).current;
  const accessoryPress = useRef(new Animated.Value(0)).current;

  const tabCount = routes.length;

  const tabItemWidth =
    tabsWidth > 0 && tabCount > 0
      ? (tabsWidth - TAB_BAR_PADDING * 2 - TAB_GAP * (tabCount - 1)) / tabCount
      : 0;

  const step = tabItemWidth + TAB_GAP;

  const selectionTranslateX =
    tabItemWidth > 0
      ? selectionProgress.interpolate({
          inputRange: routes.map((_, index) => index),
          outputRange: routes.map((_, index) => TAB_BAR_PADDING + index * step),
        })
      : 0;

  const selectionScale = selectionPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.065],
  });

  const selectionScaleY = selectionPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  const accessoryScale = accessoryPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.07],
  });

  const accessoryTranslateY = accessoryPress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  useEffect(() => {
    Animated.spring(selectionProgress, {
      toValue: activeVisualIndex,
      useNativeDriver: true,
      speed: 22,
      bounciness: 9,
    }).start();
  }, [activeVisualIndex, selectionProgress]);

  const handleTabsLayout = (event: LayoutChangeEvent) => {
    setTabsWidth(event.nativeEvent.layout.width);
  };

  const triggerSelectionHaptic = () => {
    if (Platform.OS === "ios") {
      void Haptics.selectionAsync();
    }
  };

  const triggerAccessoryHaptic = () => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const pressSelectionIn = () => {
    Animated.spring(selectionPress, {
      toValue: 1,
      useNativeDriver: true,
      speed: 34,
      bounciness: 8,
    }).start();
  };

  const pressSelectionOut = () => {
    Animated.spring(selectionPress, {
      toValue: 0,
      useNativeDriver: true,
      speed: 26,
      bounciness: 10,
    }).start();
  };

  const navigateToVisualIndex = (visualIndex: number) => {
    const route = routes[visualIndex];

    if (!route) return;

    const routeIndex = state.routes.findIndex((item) => item.key === route.key);
    const isFocused = state.index === routeIndex;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const handleTabPress = (visualIndex: number) => {
    triggerSelectionHaptic();
    navigateToVisualIndex(visualIndex);
  };

  const pressAccessoryIn = () => {
    Animated.spring(accessoryPress, {
      toValue: 1,
      useNativeDriver: true,
      speed: 34,
      bounciness: 8,
    }).start();
  };

  const pressAccessoryOut = () => {
    Animated.spring(accessoryPress, {
      toValue: 0,
      useNativeDriver: true,
      speed: 26,
      bounciness: 10,
    }).start();
  };

  const handleAccessoryPress = () => {
    triggerAccessoryHaptic();
    router.push("/produtos/novo");
  };

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.tabsShell}>
          <LiquidGlassBackground
            isDark={isDark}
            borderRadius={theme.borderRadius.pill}
          />

          <View style={styles.tabsContent} onLayout={handleTabsLayout}>
            {tabItemWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.selectionPill,
                  {
                    width: tabItemWidth,
                    transform: [
                      { translateX: selectionTranslateX },
                      { scaleX: selectionScale },
                      { scaleY: selectionScaleY },
                    ],
                  },
                ]}
              >
                <BlurView
                  intensity={Platform.OS === "android" ? 84 : 44}
                  tint={
                    isDark
                      ? "systemThinMaterialDark"
                      : "systemThinMaterialLight"
                  }
                  experimentalBlurMethod="dimezisBlurView"
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.selectionTint} />
              </Animated.View>
            )}

            {routes.map((route, visualIndex) => {
              const descriptor = descriptors[route.key];
              const routeIndex = state.routes.findIndex(
                (item) => item.key === route.key,
              );
              const isFocused = state.index === routeIndex;
              const config = ROUTE_CONFIG[route.name];

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={() => handleTabPress(visualIndex)}
                  onLongPress={onLongPress}
                  onPressIn={pressSelectionIn}
                  onPressOut={pressSelectionOut}
                  accessibilityRole="tab"
                  accessibilityLabel={
                    descriptor.options.tabBarAccessibilityLabel ?? config.label
                  }
                  accessibilityState={{ selected: isFocused }}
                  style={styles.tabPressable}
                >
                  <View style={styles.tabItem}>
                    <Ionicons
                      name={isFocused ? config.activeIcon : config.icon}
                      size={TAB_ICON_SIZE}
                      color={
                        isFocused
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.tabLabel,
                        isFocused && styles.tabLabelActive,
                      ]}
                    >
                      {config.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo produto"
          onPress={handleAccessoryPress}
          onPressIn={pressAccessoryIn}
          onPressOut={pressAccessoryOut}
          style={styles.accessoryPressable}
        >
          <Animated.View
            style={[
              styles.accessoryButton,
              {
                transform: [
                  { translateY: accessoryTranslateY },
                  { scale: accessoryScale },
                ],
              },
            ]}
          >
            <LiquidGlassBackground
              isDark={isDark}
              borderRadius={theme.borderRadius.pill}
            />

<Ionicons
  name="add"
  size={ACCESSORY_ICON_SIZE}
  color={theme.colors.primary}
/>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeType, isDark: boolean, bottomInset: number) => {
const bottomSpacing = Math.max(
  theme.spacing.md,
  bottomInset - theme.spacing.sm,
);

  return StyleSheet.create({
    wrapper: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: bottomSpacing,
      alignItems: "center",
    },

    content: {
      width: "100%",
      maxWidth: 430,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },

tabsShell: {
  flex: 1,
  height: TAB_BAR_HEIGHT,
  borderRadius: theme.borderRadius.pill,
  overflow: "hidden",
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  backgroundColor: "transparent",
  shadowColor: theme.shadow.sm.shadowColor,
  shadowOffset: theme.shadow.sm.shadowOffset,
  shadowOpacity: isDark ? 0 : 0.08,
  shadowRadius: theme.shadow.sm.shadowRadius,
  elevation: isDark ? 0 : 4,
},

    tabsContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: TAB_BAR_PADDING,
      gap: TAB_GAP,
    },

selectionPill: {
  position: "absolute",
  top: TAB_BAR_PADDING,
  bottom: TAB_BAR_PADDING,
  left: 0,
  borderRadius: theme.borderRadius.pill,
  overflow: "hidden",
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  backgroundColor: "transparent",
  shadowColor: theme.colors.primary,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: isDark ? 0 : 0.08,
  shadowRadius: 8,
  elevation: isDark ? 0 : 2,
  zIndex: 1,
},

selectionTint: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: isDark
    ? theme.colors.surfaceElevated
    : theme.colors.surfaceSecondary,
},

    tabPressable: {
      flex: 1,
      height: TAB_ITEM_HEIGHT,
      borderRadius: theme.borderRadius.pill,
      zIndex: 2,
    },

    tabItem: {
      flex: 1,
      height: TAB_ITEM_HEIGHT,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },

    tabLabel: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: "600",
      letterSpacing: -0.1,
      color: theme.colors.textSecondary,
    },

tabLabelActive: {
  color: theme.colors.primary,
  fontWeight: "700",
},

    accessoryPressable: {
      width: ACCESSORY_SIZE,
      height: ACCESSORY_SIZE,
      borderRadius: theme.borderRadius.pill,
    },

accessoryButton: {
  width: ACCESSORY_SIZE,
  height: ACCESSORY_SIZE,
  borderRadius: theme.borderRadius.pill,
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  backgroundColor: "transparent",
  shadowColor: theme.shadow.sm.shadowColor,
  shadowOffset: theme.shadow.sm.shadowOffset,
  shadowOpacity: isDark ? 0 : 0.08,
  shadowRadius: theme.shadow.sm.shadowRadius,
  elevation: isDark ? 0 : 4,
},
  });
};