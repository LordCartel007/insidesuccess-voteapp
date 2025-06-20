import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
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

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

interface AuthResult {
  redirectToVerify?: boolean;
  success?: boolean;
  [key: string]: any;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, isLoading, error, googlelogin } = useAuthStore() as {
    login: (email: string, password: string) => Promise<AuthResult>;
    isLoading: boolean;
    error: string | null;
    googlelogin: (
      email: string,
      name: string,
      picture: string
    ) => Promise<AuthResult>;
  };

  const [delayedError, setDelayedError] = useState<string | null>(null);
  //delaying error display
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setDelayedError(error);
      }, 2000);
      return () => clearTimeout(timer); // clean up
    } else {
      setDelayedError(null);
    }
  }, [error]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
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
          <source
            src="https://cartel-next-ecommerce.s3.eu-north-1.amazonaws.com/MAGNIFICA+-+LISA+%26+ZENDAYA+x+B.ZERO1+IN+BVLGARI'S+NEW+BRAND+CAMPAIGN+-+Bvlgari+(1080p%2C+h264).mp4"
            type="video/mp4"
          />
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
                  onClick={() => googleSignIn()}
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
