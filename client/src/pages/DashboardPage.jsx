import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";
import { serverApi } from "../api";
import { useCallback } from "react";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const userId = queryClient.getQueryData(["userId"]);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await serverApi.get(`/users/${userId}`);
      return result.data;
    },
  });

  const { data: linkToken } = useQuery({
    queryKey: ["linkToken"],
    queryFn: async () => {
      const result = await serverApi.post("/plaid/create-link-token", {
        userId,
      });
      return result.data.link_token;
    },
    enabled: user?.isPlaidConnected,
  });

  const onLinkSuccess = useCallback(
    async (public_token) => {
      console.log({ public_token });
      const result = await serverApi.post("/plaid/set-access-token", {
        userId,
        publicToken: public_token,
      });
      if (result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    [userId, queryClient]
  );

  return (
    <div className="flex h-full">
      <Sidebar
        isPlaidConnected={user?.isPlaidConnected}
        linkToken={linkToken}
        onLinkSuccess={onLinkSuccess}
      />
      <Navbar
        user={user}
        logout={() => {
          queryClient.clear();
        }}
      >
        <div className="flex h-full w-full items-center">
          This is the dashboard. Logged user: {user?.name}
        </div>
      </Navbar>
    </div>
  );
};
