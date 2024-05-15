import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useFiatAccount = (user) => {
  const { data = [], status } = useQuery({
    queryKey: ["fiat-accounts"],
    queryFn: async () => {
      const result = await serverApi.get(`/plaid/accounts/${user?.id}`);
      return result.data;
    },
    enabled: Boolean(user?.isPlaidConnected),
  });

  return { data, status };
};
