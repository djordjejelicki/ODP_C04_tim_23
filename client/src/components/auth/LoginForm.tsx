import { Link, useNavigate } from "react-router-dom";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useState } from "react";
import { validateLogin } from "../../validators/authValidator";

export function LoginForm({ authApi }: AuthFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const validation = validateLogin(username, password);
    if (!validation.valid){
      setMessage(validation.message);
      return;
    }

    const response = await authApi.login(username, password);

    if (!response.success || !response.data) {
      setMessage(response.message);
      return;
    }

    login(response.data);
    navigate("/trails");
  };

  return (
   <form
      onSubmit={submitForm}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-5"
   >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <p className="text-gray-500">Sign in to TrailSync</p>
      </div>

      {message && (
        <div className="rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800"
      >
        Login
      </button>

      <p className="text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-orange-700 font-semibold">
          Register
        </Link>
      </p>
   </form>
  );
}
