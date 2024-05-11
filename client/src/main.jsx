import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { App } from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider className="h-full">
      <QueryClientProvider client={queryClient}>
        <main className="dark text-foreground bg-background h-full">
          <App />
        </main>
      </QueryClientProvider>
    </NextUIProvider>
  </React.StrictMode>
);
