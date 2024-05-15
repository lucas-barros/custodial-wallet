import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api";

export const useLinkToken = () => {
  const { data, status } = useQuery({
    queryKey: ["link-token"],
    queryFn: async () => {
      const result = await serverApi.post("/plaid/create-link-token");
      return result.data.link_token;
    },
  });

  return { data, status };
};
