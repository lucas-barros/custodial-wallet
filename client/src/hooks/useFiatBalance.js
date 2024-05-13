import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useFiatBalance = (user) => {
  const { data, status } = useQuery({
    queryKey: ["fiatBalance"],
    queryFn: async () => {
      const result = await serverApi.get(`/plaid/balance/${user?.id}`);
      return result.data;
    },
    enabled: Boolean(user?.isPlaidConnected),
  });

  return { data, status };
};
