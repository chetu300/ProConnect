import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    const newUser = {
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await signup(newUser);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <img src={logo} alt="ProConnect" className="mx-auto h-16 w-16" />
          <h1 className="mt-3 text-2xl font-bold text-ink-primary">Join ProConnect</h1>
          <p className="text-sm text-ink-secondary">Create your professional profile</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="input input-bordered auth-input w-full" name="name" placeholder="Full name" required />
          <input className="input input-bordered auth-input w-full" name="username" placeholder="Username" required />
          <input className="input input-bordered auth-input w-full" name="email" type="email" placeholder="Email" required />
          <input className="input input-bordered auth-input w-full" name="password" type="password" minLength="6" placeholder="Password (6+ characters)" required />
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <button className="btn btn-primary w-full" type="submit">Create account</button>
        </form>
        <p className="mt-5 text-center text-sm text-ink-secondary">
          Already have an account? <Link className="link link-primary" to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
