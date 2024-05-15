import { useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";
import { serverApi } from "../api";
import { useCallback, useState } from "react";
import { useLoggedUser } from "../hooks/useLoggedUser";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { useFiatAccount } from "../hooks/useFiatAccount";
import { Balance } from "../components/Balance";
import { useBtcAccount } from "../hooks/useBtcAccount";
import { PlaidLinkButton } from "../components/PlaidLink";
import { Code, Input } from "@nextui-org/react";
import { useBuyBtc } from "../hooks/useBuyBtc";
import { useLinkToken } from "../hooks/useLinkToken";
import { FiatAccountSelect } from "../components/FiatAccountSelect";
import { BuyBtcButton } from "../components/BuyBtcButton";
import { useBtcInUsd } from "../hooks/useBtcInUsd";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useLoggedUser();
  const fiatAccountQuery = useFiatAccount(user);
  const btcAccountQuery = useBtcAccount(user);
  const { buyBtc, buyBtcResponse, buyBtcError, status } = useBuyBtc(user);
  const { data: linkToken } = useLinkToken(user);

  const btcInUsdQuery = useBtcInUsd();
  const [fiatAccountId, setFiatAccountId] = useState();
  const [fiatAmount, setFiatAmount] = useState(0);
  const btcValue = btcInUsdQuery.data ? fiatAmount / btcInUsdQuery.data : 0;

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
        btcInUsdQuery={btcInUsdQuery}
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
                <div className="flex flex-row w-full gap-4">
                  <FiatAccountSelect
                    accounts={fiatAccountQuery.data}
                    onChange={setFiatAccountId}
                  />
                  <BuyBtcButton
                    isEnabled={fiatAccountId}
                    onClick={() => {
                      buyBtc({ fiatAmount, fiatAccountId });
                    }}
                    isLoading={status === "pending"}
                  />
                </div>

                <div className="flex flex-row w-full gap-4">
                  <Input
                    className="max-w-xs"
                    value={fiatAmount}
                    onChange={(e) => setFiatAmount(e.target.value)}
                    type="number"
                    label="Fiat"
                    max={
                      fiatAccountQuery.data.find(
                        (account) => account.id === fiatAccountId
                      )?.balance
                    }
                  />
                  <Input
                    disabled
                    className="max-w-xs"
                    value={btcValue.toFixed(8)}
                    type="text"
                    label="BTC"
                  />
                </div>
              </div>
            </div>
            {buyBtcError && <Code className="text-center">{buyBtcError}</Code>}
            {buyBtcResponse && (
              <Code className="text-center">Purchase Successful</Code>
            )}
          </div>
        </div>
      </Navbar>
    </div>
  );
};
