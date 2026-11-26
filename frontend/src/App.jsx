import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import BuildWithMePage from "./pages/BuildWithMePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="profile/:username" element={<ProfilePage />} />
                <Route path="network" element={<NetworkPage />} />
                <Route path="build" element={<BuildWithMePage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
