import { useQueryClient } from "@tanstack/react-query";

export const useLoggedUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(["userId"]);
};
