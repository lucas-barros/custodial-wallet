import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useBtcAccount = (user) => {
  const { data, status } = useQuery({
    queryKey: ["btc-account"],
    queryFn: async () => {
      const result = await serverApi.get(`/users/${user?.id}/btc`);
      return result.data;
    },
    enabled: Boolean(user?.id),
  });

  return { data, status };
};
