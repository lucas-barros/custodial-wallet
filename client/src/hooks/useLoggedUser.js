import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useLoggedUser = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await serverApi.get("/users");
      return result.data;
    },
    enabled: Boolean(localStorage.getItem("token")),
  });
  return user;
};
