import { useMutation } from "@tanstack/react-query";
import { AuthForm } from "../components/AuthForm";
import { serverApi } from "../api";

export const AuthPage = () => {
  const mutation = useMutation({
    mutationFn: (newUser) => serverApi.post("/users", newUser),
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
