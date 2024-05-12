import { useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/NavBar";

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData("user");
  return (
    <div className="flex h-full">
      <Sidebar />
      <Navbar
        user={user}
        logout={() => {
          queryClient.setQueryData("user", {});
        }}
      >
        <div className="flex h-full w-full items-center">
          This is the dashboard. Logged user: {user?.name}
        </div>
      </Navbar>
    </div>
  );
};
