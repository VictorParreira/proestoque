import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import type { ThemeType } from "../../constants/theme";
import { useAppTheme } from "../../contexts/ThemeContext";

export function SettingsDivider() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return <View style={styles.divider} />;
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.separator,
      marginLeft: 64,
    },
  });
