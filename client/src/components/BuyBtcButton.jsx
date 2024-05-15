import React from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

export const BuyBtcButton = ({ isEnabled, isLoading, onClick }) => {
  if (isEnabled) {
    return (
      <Button
        className="h-full"
        color="primary"
        onClick={onClick}
        isLoading={isLoading}
      >
        Buy BTC
      </Button>
    );
  }
  return (
    <Popover showArrow={true} color="foreground">
      <PopoverTrigger>
        <Button className="h-full" color="default" isLoading={isLoading}>
          Buy BTC
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">Select a fiat account</div>
      </PopoverContent>
    </Popover>
  );
};
