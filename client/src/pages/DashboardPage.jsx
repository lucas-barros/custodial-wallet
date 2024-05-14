import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";
import { serverApi } from "../api";
import { useCallback } from "react";
import { useLoggedUser } from "../hooks/useLoggedUser";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useFiatBalance } from "../hooks/useFiatBalance";
import { Balance } from "../components/Balance";
import { useBtcAccount } from "../hooks/useBtcBalance";
import { PlaidLinkButton } from "../components/PlaidLink";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useLoggedUser();
  const plaidBalanceQuery = useFiatBalance(user);
  const btcAccountQuery = useBtcAccount(user);

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
        <div className="flex flex-col h-full w-full p-3 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Available Fiat Balance</h3>
            {user?.isPlaidConnected ? (
              <Balance
                accounts={plaidBalanceQuery.data}
                status={plaidBalanceQuery.status}
              />
            ) : (
              <div className="flex flex-row">
                <PlaidLinkButton token={linkToken} onSuccess={onLinkSuccess} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Available BTC Balance</h3>
            <Balance
              accounts={[
                {
                  balance: btcAccountQuery.data?.balance,
                  name: "Bitcoin account",
                  currency: "BTC",
                },
              ]}
              status={btcAccountQuery.status}
            />
          </div>
        </div>
      </Navbar>
    </div>
  );
};
