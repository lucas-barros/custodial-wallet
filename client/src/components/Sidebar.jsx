import React from "react";
import { Avatar } from "@nextui-org/react";

import { tv } from "@nextui-org/react";

export const Wrapper = tv({
  base: "bg-background transition-transform h-full fixed -translate-x-full w-64 shrink-0 z-[202] overflow-y-auto border-r border-divider flex-col py-6 px-3 md:ml-0 md:flex md:static md:h-screen md:translate-x-0 ",
});

export const Sidebar = () => {
  return (
    <aside className="h-screen z-[20] sticky top-0">
      <div className={Wrapper()}>
        <div className="flex gap-8 items-center px-3">
          <Avatar name="BW" />
          <div className="flex flex-col">
            <p className="text-md">Bitcoin Wallet</p>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6 mt-9 px-3">Home</div>
        </div>
      </div>
    </aside>
  );
};
