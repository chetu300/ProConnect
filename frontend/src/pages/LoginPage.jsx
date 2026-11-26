import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      await login(formData.get("email"), formData.get("password"));
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  }

  async function handleGoogleLogin(result) {
    try {
      await loginWithGoogle(result.credential);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Google login failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <img src={logo} alt="ProConnect" className="mx-auto h-16 w-16" />
          <h1 className="mt-3 text-2xl font-bold text-ink-primary">Welcome back</h1>
          <p className="text-sm text-ink-secondary">Login to your ProConnect account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="input input-bordered auth-input w-full" name="email" type="email" placeholder="Email" required />
          <div>
            <input className="input input-bordered auth-input w-full" name="password" type="password" placeholder="Password" required />
          </div>
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <button className="btn btn-primary w-full" type="submit">Login</button>
        </form>
        <div className="my-5 flex justify-center">
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setErrorMessage("Google login failed")} />
          ) : (
            <p className="text-center text-xs text-ink-secondary">Set VITE_GOOGLE_CLIENT_ID to enable Google login.</p>
          )}
        </div>
        <p className="text-center text-sm text-ink-secondary">
          New to ProConnect? <Link className="link link-primary" to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
