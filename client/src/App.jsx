import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useTheme } from "./providers/theme/hook";
import "./App.css";

export const App = () => {
  const { isDarkMode } = useTheme();
  return (
    <main
      className={`${
        isDarkMode ? "dark" : "light"
      } text-foreground bg-background h-full`}
    >
      <RouterProvider router={router} />
    </main>
  );
};
