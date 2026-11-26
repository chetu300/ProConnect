import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then((response) => setUser(response.data))
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error("Could not check login:", error.message);
        }
      })
      .finally(() => setCheckingLogin(false));
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    setUser(response.data);
  }

  async function signup(formData) {
    const response = await api.post("/auth/signup", formData);
    setUser(response.data);
  }

  async function loginWithGoogle(credential) {
    const response = await api.post("/auth/google", { credential });
    setUser(response.data);
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  async function resetPassword(token, password) {
    const response = await api.post("/auth/reset-password", { token, password });
    return response.data;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, checkingLogin, login, signup, loginWithGoogle, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
