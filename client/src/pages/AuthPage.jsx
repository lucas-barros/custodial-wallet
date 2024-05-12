import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { serverApi } from "../api";
import { routes } from "../routes";

export const AuthPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newUser) => serverApi.post("/users", newUser),
    onSuccess: (result, variables) => {
      queryClient.setQueryData("user", () => ({
        id: result.data.userId,
        ...variables,
      }));
      navigate(routes.dashboard);
    },
  });
  return (
    <div className="flex h-full items-center">
      <AuthForm
        status={mutation.status}
        onSignUp={(newUser) => mutation.mutate(newUser)}
      />
    </div>
  );
};
