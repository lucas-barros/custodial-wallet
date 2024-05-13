import { useQuery, useQueryClient } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useLoggedUser = () => {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData(["user"]);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await serverApi.get(`/users/${cachedUser.id}`);
      return result.data;
    },
    enabled: Boolean(cachedUser?.id),
  });

  return user || cachedUser;
};
