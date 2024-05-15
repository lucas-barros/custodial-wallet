import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useBtcAccount = () => {
  const { data, status } = useQuery({
    queryKey: ["btc-account"],
    queryFn: async () => {
      const result = await serverApi.get("/users/btc");
      return result.data;
    },
  });

  return { data, status };
};
