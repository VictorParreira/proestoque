import { useMemo } from "react";

type DashboardGreeting = {
  greeting: string;
  formattedDate: string;
  displayName: string;
  userInitial: string;
};

export function useDashboardGreeting(
  userName?: string | null,
): DashboardGreeting {
  return useMemo(() => {
    const hour = new Date().getHours();

    const greeting =
      hour >= 5 && hour < 12
        ? "Bom dia"
        : hour >= 12 && hour < 18
          ? "Boa tarde"
          : "Boa noite";

    const currentDate = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
    }).format(new Date());

    const formattedDate =
      currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

    const displayName = userName?.trim() || "Visitante";
    const userInitial = displayName.charAt(0).toUpperCase() || "?";

    return {
      greeting,
      formattedDate,
      displayName,
      userInitial,
    };
  }, [userName]);
}
