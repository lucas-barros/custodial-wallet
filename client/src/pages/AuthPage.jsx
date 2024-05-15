import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { serverApi } from "../api";
import { routes } from "../routes";

export const AuthPage = () => {
  const navigate = useNavigate();

  const signUpUserMutation = useMutation({
    mutationFn: (newUser) => serverApi.post("/auth/sign-up", newUser),
    onSuccess: (result) => {
      localStorage.setItem("token", result.data);
      navigate(routes.dashboard);
    },
  });

  const signInUserMutation = useMutation({
    mutationFn: (credentials) => serverApi.post("/auth/sign-in", credentials),
    onSuccess: (result) => {
      localStorage.setItem("token", result.data);
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
