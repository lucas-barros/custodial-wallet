import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const routes = {
  root: "/",
  signIn: "/sign-in",
  dashboard: "/dashboard",
};

export const router = createBrowserRouter([
  {
    path: routes.root,
    Component: AuthPage,
  },
  {
    path: routes.signIn,
    Component: AuthPage,
  },
  {
    path: routes.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
