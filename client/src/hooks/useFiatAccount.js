import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useFiatAccount = (isPlaidConnected = false) => {
  const { data = [], status } = useQuery({
    queryKey: ["fiat-accounts"],
    queryFn: async () => {
      const result = await serverApi.get("/plaid/accounts/");
      return result.data;
    },
    enabled: isPlaidConnected,
  });

  return { data, status };
};
