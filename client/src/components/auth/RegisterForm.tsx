import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";

export function RegisterForm({ authApi }: AuthFormProps) {
  
  const navigate = useNavigate();

  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage]     = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const response = await authApi.register(
      username,
      email,
      password,
      firstName,
      lastName
    );

    if (!response.success){
      setMessage(response.message);
      return;
    }

    navigate("/login");
  }

  return (
   <form
      onSubmit={submitForm}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-5"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create account
        </h1>

        <p className="text-gray-500">
          Register for TrailSync
        </p>
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
          Email
        </label>

        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First name
          </label>

          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last name
          </label>

          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>

        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>

        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-orange-700 text-white py-2 font-semibold hover:bg-orange-800"
      >
        Register
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-orange-700 font-semibold">
          Login
        </Link>
      </p>
    </form>
  );
}
