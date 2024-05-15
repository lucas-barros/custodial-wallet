import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useBuyBtc = () => {
  const queryClient = useQueryClient();
  const {
    mutate: buyBtc,
    data: buyBtcResponse,
    error,
    status,
  } = useMutation({
    mutationFn: ({ fiatAmount, fiatAccountId }) =>
      serverApi.post(`/users/btc/buy`, {
        fiatAmount,
        fiatAccountId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["btc-account"] });
    },
  });

  return {
    buyBtc,
    buyBtcResponse,
    buyBtcError: error?.response.data.error,
    status,
  };
};
