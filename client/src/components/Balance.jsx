import React from "react";
import { BalanceSkeleton } from "./BalanceSkeleton";
import { AccountBalance } from "./AccountBalance";

export const Balance = ({ accounts, status }) => {
  return (
    <div className="flex flex-row gap-5">
      {status === "pending" &&
        [1, 2, 3].map((id) => <BalanceSkeleton key={id} />)}
      {status === "success" &&
        accounts.map(({ id, ...account }) => (
          <AccountBalance key={id} {...account} />
        ))}
    </div>
  );
};
