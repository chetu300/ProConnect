import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not reset password");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <img src={logo} alt="ProConnect" className="mx-auto h-16 w-16" />
          <h1 className="mt-3 text-2xl font-bold text-ink-primary">Reset your password</h1>
          <p className="text-sm text-ink-secondary">Choose a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="input input-bordered auth-input w-full"
            name="password"
            type="password"
            minLength="6"
            placeholder="New password (6+ characters)"
            required
          />
          <input
            className="input input-bordered auth-input w-full"
            name="confirmPassword"
            type="password"
            minLength="6"
            placeholder="Confirm new password"
            required
          />
          {message && (
            <div className="rounded-xl bg-brand-indigo/10 p-3 text-sm text-brand-indigo">
              {message}
            </div>
          )}
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <button className="btn btn-primary w-full" type="submit">Reset password</button>
        </form>
        <p className="mt-5 text-center text-sm text-ink-secondary">
          <Link className="link link-primary" to="/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
