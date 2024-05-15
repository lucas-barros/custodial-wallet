import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useBuyBtc = (user) => {
  const queryClient = useQueryClient();
  const { mutate: buyBtc, status } = useMutation({
    mutationFn: (amount) =>
      serverApi.post(`/users/${user?.id}/btc/buy`, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["btc-account"] });
    },
  });

  return { buyBtc, status };
};
