import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useLinkToken = (user) => {
  const { data, status } = useQuery({
    queryKey: ["linkToken"],
    queryFn: async () => {
      const result = await serverApi.post("/plaid/create-link-token", {
        userId: user?.id,
      });
      return result.data.link_token;
    },
  });

  return { data, status };
};
