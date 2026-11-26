import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { user, login, loginWithGoogle, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

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

  async function handleForgotPassword(event) {
    event.preventDefault();
    setResetError("");
    setResetMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await forgotPassword(formData.get("resetEmail"));
      setResetMessage(response.message);
    } catch (error) {
      setResetError(error.response?.data?.message || "Could not send reset link");
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
            <div className="mt-1 flex justify-end">
            <button
              type="button"
              className="link link-primary text-xs"
              onClick={() => {
                setResetMessage("");
                setResetError("");
                setShowForgotPassword(true);
              }}
            >
              Forgot password?
            </button>
            </div>
          </div>
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <button className="btn btn-primary w-full" type="submit">Login</button>
        </form>
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
          <div className="card w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-ink-primary">Forgot password</h2>
            <p className="mt-1 text-sm text-ink-secondary">Enter your email and we’ll send you a reset link.</p>
              <form onSubmit={handleForgotPassword} className="mt-5 flex flex-col gap-4">
                <input
                  className="input input-bordered auth-input w-full"
                  name="resetEmail"
                  type="email"
                  placeholder="Email"
                  required
                />
                {resetMessage && <p className="text-sm text-brand-indigo">{resetMessage}</p>}
                {resetError && <p className="text-sm text-red-600">{resetError}</p>}
                <button className="btn btn-primary w-full" type="submit">Send reset link</button>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to login
                </button>
              </form>
            </div>
          </div>
        )}
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
