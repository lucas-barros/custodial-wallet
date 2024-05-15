import { useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";
import { serverApi } from "../api";
import { useCallback } from "react";
import { useLoggedUser } from "../hooks/useLoggedUser";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useFiatAccount } from "../hooks/useFiatAccount";
import { Balance } from "../components/Balance";
import { useBtcAccount } from "../hooks/useBtcBalance";
import { PlaidLinkButton } from "../components/PlaidLink";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useBuyBtc } from "../hooks/useBuyBtc";
import { useLinkToken } from "../hooks/useLinkToken";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useLoggedUser();
  const fiatAccountQuery = useFiatAccount(user);
  const btcAccountQuery = useBtcAccount(user);
  const { buyBtc, status } = useBuyBtc(user);
  const { data: linkToken } = useLinkToken(user);

  const onLinkSuccess = useCallback(
    async (public_token) => {
      const result = await serverApi.post("/plaid/set-access-token", {
        userId: user?.id,
        publicToken: public_token,
      });
      if (result.data.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["fiat-balance"] });
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
                accounts={fiatAccountQuery.data}
                status={fiatAccountQuery.status}
              />
            ) : (
              <div className="flex flex-row">
                <PlaidLinkButton token={linkToken} onSuccess={onLinkSuccess} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Available BTC Balance</h3>
            <div className="flex flex-row gap-4">
              <Balance
                accounts={[
                  {
                    balance: btcAccountQuery.data?.balance,
                    name: "Bitcoin account",
                    currency: "BTC",
                    id: "btc",
                  },
                ]}
                status={btcAccountQuery.status}
              />
              <div className="flex flex-col w-full gap-4">
                <Select
                  isDisabled={!fiatAccountQuery.data}
                  label="Select a fiat account"
                  className="max-w-xs"
                >
                  {fiatAccountQuery.data?.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </Select>
                <div>
                  <Button
                    color={fiatAccountQuery.data ? "primary" : "default"}
                    isDisabled={!fiatAccountQuery.data}
                    onClick={() => buyBtc(0.5)}
                    isLoading={status === "pending"}
                  >
                    Buy BTC
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};
