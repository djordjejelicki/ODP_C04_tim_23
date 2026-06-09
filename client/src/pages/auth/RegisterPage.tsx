import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../../components/auth/RegisterForm";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface RegisterPageProps {
  authApi: IAuthAPIService;
}

export default function RegisterPage({ authApi }: RegisterPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) 
      navigate(`/trails`);
  }, [isAuthenticated, navigate, user]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <RegisterForm authApi={authApi} />
    </main>
  );
}
