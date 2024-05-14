import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { serverApi } from "../api";
import { routes } from "../routes";

export const AuthPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const signUpUserMutation = useMutation({
    mutationFn: (newUser) => serverApi.post("/users", newUser),
    onSuccess: (result) => {
      queryClient.setQueryData(["user"], () => result.data);
      navigate(routes.dashboard);
    },
  });

  const signInUserMutation = useMutation({
    mutationFn: (credentials) => serverApi.post("/users/sign-in", credentials),
    onSuccess: (result) => {
      queryClient.setQueryData(["user"], () => result.data);
      navigate(routes.dashboard);
    },
  });

  return (
    <div className="flex h-full items-center">
      <AuthForm
        signInStatus={signInUserMutation.status}
        signUpStatus={signUpUserMutation.status}
        onSignUp={(newUser) => signUpUserMutation.mutate(newUser)}
        onSignIn={(credentials) => signInUserMutation.mutate(credentials)}
      />
    </div>
  );
};
