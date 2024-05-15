import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useBtcInUsd = () => {
  const { data: { rate = undefined } = {}, status } = useQuery({
    queryKey: ["btc-in-usd"],
    queryFn: async () => {
      const result = await serverApi.get("/rate/btc/usd");
      return result.data;
    },
    gcTime: 10_000,
  });

  return { data: rate, status };
};
