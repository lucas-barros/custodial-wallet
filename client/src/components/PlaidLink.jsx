import React from "react";
import { Button } from "@nextui-org/react";
import { usePlaidLink } from "react-plaid-link";

export const PlaidLinkButton = ({ token, onSuccess }) => {
  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <Button onClick={() => open()} disabled={!ready}>
      Link plaid account
    </Button>
  );
};
