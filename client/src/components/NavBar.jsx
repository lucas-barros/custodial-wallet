import React from "react";
import {
  Navbar as NextNavbar,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { useTheme } from "../providers/theme/hook";

export const Navbar = ({ user, logout, children }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <NextNavbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full justify-end",
        }}
      >
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Avatar
                  as="button"
                  color="secondary"
                  size="md"
                  name={user?.name}
                />
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="User menu actions"
              onAction={(actionKey) => console.log({ actionKey })}
            >
              <DropdownItem
                key="profile"
                className="flex flex-col justify-start w-full items-start"
              >
                <p>Signed in as</p>
                <p>{user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onClick={logout}
              >
                Log Out
              </DropdownItem>
              <DropdownItem key="switch">
                <Switch
                  isSelected={isDarkMode}
                  onValueChange={() => toggleTheme()}
                />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </NextNavbar>
      {children}
    </div>
  );
};
