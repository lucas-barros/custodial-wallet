import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";
import { serverApi } from "../api";
import { useCallback } from "react";
import { useLoggedUser } from "../hooks/useLoggedUser";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useLoggedUser();

  const { data: linkToken } = useQuery({
    queryKey: ["linkToken"],
    queryFn: async () => {
      const result = await serverApi.post("/plaid/create-link-token", {
        userId: user?.id,
      });
      return result.data.link_token;
    },
    enabled: !user?.isPlaidConnected,
  });

  const onLinkSuccess = useCallback(
    async (public_token) => {
      const result = await serverApi.post("/plaid/set-access-token", {
        userId: user?.id,
        publicToken: public_token,
      });
      if (result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    [user?.id, queryClient]
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
          queryClient.invalidateQueries({ queryKey: ["user"] });
          navigate(routes.root);
        }}
      >
        <div className="flex h-full w-full items-center">
          This is the dashboard. Logged user: {user?.name}
        </div>
      </Navbar>
    </div>
  );
};
