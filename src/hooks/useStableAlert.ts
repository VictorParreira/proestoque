import { useCallback, useEffect, useRef } from "react";
import { Alert, type AlertButton } from "react-native";

const DEFAULT_ALERT_DELAY_MS = 450;

export function useStableAlert(delayMs = DEFAULT_ALERT_DELAY_MS) {
  const isAlertVisibleRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (title: string, message: string, buttons?: AlertButton[]) => {
      if (isAlertVisibleRef.current) return;

      isAlertVisibleRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;

        const resolvedButtons = buttons?.length
          ? buttons
          : [{ text: "OK" } satisfies AlertButton];

        const wrappedButtons = resolvedButtons.map((button) => ({
          ...button,
          onPress: () => {
            isAlertVisibleRef.current = false;
            button.onPress?.();
          },
        }));

        Alert.alert(title, message, wrappedButtons, {
          onDismiss: () => {
            isAlertVisibleRef.current = false;
          },
        });
      }, delayMs);
    },
    [delayMs],
  );
}