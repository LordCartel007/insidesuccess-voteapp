import React, { useEffect, ReactNode } from "react";
import FloatingShape from "./components/FloatingShape";
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import AllDecisionPage from "./pages/AllDecision";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/HomePage";
import HomePage from "./pages/HomePage";
import CreateDecisionRoomPage from "./pages/CreateDecisionRoomPage";

// Define types for ProtectedRoute and RedirectAuthenticatedUser props
interface ProtectedRouteProps {
  children: ReactNode;
}

interface RedirectAuthenticatedUserProps {
  children: ReactNode;
}

//protect routes that require authentication
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/homepage" replace />;
  }
  // if (!user.isVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }
  return children;
};

//redirect authenticated users to the home page
const RedirectAuthenticatedUser: React.FC<RedirectAuthenticatedUserProps> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/create-decision-room"
            element={<CreateDecisionRoomPage />}
          />
          <Route path="/all-decisions" element={<AllDecisionPage />} />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/homepage" element={<HomePage />} />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Routes>

        <Toaster />
      </div>
    </>
  );
}

export default App;
