import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Input from "@/components/Input";
import { User, Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import "../components/VideoBackground.css";
import Footer from "../components/Footer";
import { useGoogleLogin } from "@react-oauth/google";

const StyledDiv = styled.div`
  height: 100vh;
  width: 100vw;
`;

const SignUpPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //destructuring from the auth store
  const { signup, error, isLoading, googlelogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    //tryand catch block to handle errors
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  //googlesignin
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
        {/* <video autoPlay loop muted playsInline className="background-clip">
          <source src="" type="video/mp4" />
        </video> */}
        <div className="content  ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" max-w-md center w-full bg-transparent  
   rounded-2xl shadow-xl overflow-hidden
   "
          >
            <div className="p-8">
              <h2
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r
        from-green-400 to-emerald-500 text-transparent bg-clip-text"
              >
                Create Account
              </h2>
              <form onSubmit={handleSignUp}>
                <Input
                  icon={User}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />

                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/*showing error */}
                {error && (
                  <p className="text-red-500 font-semiBold mt-2">{error} </p>
                )}

                {/* Password strength meter */}

                <PasswordStrengthMeter password={password} />

                <motion.button
                  className="mt-5 w-full py-3 px-4 mt-b
          bg-gradient-to-r  from-green-500 to-emerald-600 text-white font-bold 
          rounded-lg  shadow-lg hover:from-green-600 hover:to-emerald-700
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          focus:ring-offset-gray-900 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>
              </form>
              <p className="text-black"> Or</p>
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
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link to={"/login"} className="text-green-400 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </StyledDiv>
      <Footer />
    </>
  );
};

export default SignUpPage;
