import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

export const FiatAccountSelect = ({ accounts = [], onChange }) => {
  return (
    <Select
      isDisabled={!accounts.length}
      label="Select a fiat account"
      className="max-w-xs"
      onChange={(e) => onChange(e.target.value)}
    >
      {accounts.map(({ id, name }) => (
        <SelectItem key={id} value={id}>
          {name}
        </SelectItem>
      ))}
    </Select>
  );
};
