import React from "react";
import { Card, CardBody } from "@nextui-org/react";

export const AccountBalance = ({ name, balance, currency }) => {
  return (
    <Card className="bg-success rounded-xl shadow-md px-3">
      <CardBody className="py-5 overflow-hidden">
        <div className="flex gap-2.5">
          <div className="flex flex-col">
            <span className="text-white">{name}</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-nowrap text-xl font-semibold">
            <span className="inline-block">Total balance:</span>
            <br />
            <span className="inline-block">
              {balance} {currency}
            </span>
          </span>
        </div>
      </CardBody>
    </Card>
  );
};
