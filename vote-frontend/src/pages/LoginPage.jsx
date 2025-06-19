import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "@/components/Input.jsx";
import { useAuthStore } from "@/store/authStore.js";
import Header from "../components/Header.jsx";
import styled from "styled-components";
import "../components/VideoBackground.css";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// Google sign-in

import { useGoogleLogin } from "@react-oauth/google";

const StyledDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error, googlelogin } = useAuthStore();

  const [delayedError, setDelayedError] = useState(null);
  //delaying error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setDelayedError(error);
      }, 2000);
      return () => clearTimeout(timer); // clean up
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result?.redirectToVerify) {
      navigate("/verify-email");
    } else if (result?.success) {
      navigate("/dashboard");
    }
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google's API using the access token
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const user = await res.json();
        console.log("User:", user);

        // Send user data to the backend using zustand auth store
        const result = await googlelogin(user.email, user.name, user.picture);
        if (result?.redirectToVerify) {
          navigate("/verify-email");
        } else if (result?.success) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <>
      <Header />
      <StyledDiv className="containervideo">
        <video autoPlay loop muted playsInline className="background-clip">
          <source src="" type="video/mp4" />
        </video>
        <div className="content">
          {/*login*/}
          <div className="min-h-screen  flex items-center justify-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full 
    backdrop-filter  rounded-2xl shadow-xl
    overflow-hidden"
            >
              <div className="p-8">
                <h2
                  className="text-3xl font-bold mb-6 text-center
        bg-gradient-to-r from-green-400 to-emerald-500
        text-transparent bg-clip-text"
                >
                  Welcome Back
                </h2>

                <form onSubmit={handleLogin}>
                  <Input
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex items-center mb-6">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-green-400
            hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  {delayedError && (
                    <p className="text-red-500 font-semibold mb-2">{error}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-500
          to-emerald-600 text-white font-bold rounded-lg shadow-lg
          hover:from-green-600 hover:to-emerald-700 focus:outline-none 
          focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
          focus:ring-offset-gray-900 transition duration duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader
                        className="w-6 h-6 animate-spin
            mx-auto"
                      />
                    ) : (
                      "Login"
                    )}
                  </motion.button>
                  <p className="text-black"> Or</p>
                </form>
                <motion.button
                  onClick={googleSignIn}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500
          to-emerald-600 text-white font-bold rounded-lg shadow-lg
          hover:from-green-600 hover:to-emerald-700 focus:outline-none 
          focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
          focus:ring-offset-gray-900 transition duration duration-200"
                >
                  Sign In with Google
                </motion.button>
              </div>
              <div
                className="px-8 py-4 bg-gray-900 bg-opacity-50
      flex justify-center"
              >
                {" "}
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-green-400 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
              <></>
            </motion.div>
          </div>
        </div>
      </StyledDiv>
      <Footer />
    </>
  );
};

export default LoginPage;
