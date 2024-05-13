import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";
import { serverApi } from "../api";
import { useCallback } from "react";
import { useLoggedUser } from "../hooks/useLoggedUser";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useFiatBalance } from "../hooks/useFiatBalance";
import { FiatBalance } from "../components/FiatBalance";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useLoggedUser();
  const plaidBalanceQuery = useFiatBalance(user);

  const { data: linkToken } = useQuery({
    queryKey: ["linkToken"],
    queryFn: async () => {
      const result = await serverApi.post("/plaid/create-link-token", {
        userId: user?.id,
      });
      return result.data.link_token;
    },
  });

  const onLinkSuccess = useCallback(
    async (public_token) => {
      const result = await serverApi.post("/plaid/set-access-token", {
        userId: user?.id,
        publicToken: public_token,
      });
      if (result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["fiatBalance"] });
      }
    },
    [user?.id, queryClient]
  );

  return (
    <div className="flex h-full">
      <Sidebar linkToken={linkToken} onLinkSuccess={onLinkSuccess} />
      <Navbar
        user={user}
        logout={() => {
          queryClient.clear();
          queryClient.invalidateQueries({ queryKey: ["user"] });
          navigate(routes.root);
        }}
      >
        <div className="flex flex-col h-full w-full p-3 gap-2">
          <h3 className="text-xl font-semibold">Available Fiat Balance</h3>
          <FiatBalance
            accounts={plaidBalanceQuery.data}
            status={plaidBalanceQuery.status}
          />
        </div>
      </Navbar>
    </div>
  );
};
