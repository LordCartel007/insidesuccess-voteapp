import React, { FormEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import Input from "../components/Input";
import toast from "react-hot-toast";
import styled from "styled-components";

const StyledDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;
// reset password page
const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token as string, password);

      toast.success("Password reset successfully, redirecting to login page");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      const typedError = err as { message?: string };
      toast.error(typedError.message || "Error resetting password");
      console.error(err);
    }
  };

  return (
    <>
      <StyledDiv className="containervideo">
        <video autoPlay loop muted playsInline className="background-clip">
          <source
            src="https://cartel-next-ecommerce.s3.eu-north-1.amazonaws.com/MAGNIFICA+-+LISA+%26+ZENDAYA+x+B.ZERO1+IN+BVLGARI'S+NEW+BRAND+CAMPAIGN+-+Bvlgari+(1080p%2C+h264).mp4"
            type="video/mp4"
          />
        </video>
        <div className="content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md center mt-20 w-full bg-transparent
    backdrop-filter  rounded-2xl shadow-xl
    overflow-hidden
    "
          >
            <div className="p-8">
              <h2
                className="text-3xl font-bold mb-6 text-center
            bg-gradient-to-r from-green-400 to-emerald-500
            text-transparent bg-clip-text"
              >
                Reset Password
              </h2>
              {error && <p className="text-red-500 text-sm mb-4"> {error}</p>}
              {message && (
                <p className="text-green-500 text-sm mb-4"> {message}</p>
              )}

              <form onSubmit={handleSubmit}>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className=" w-full py-3 px-4 bg-gradient-to-r from-green-500
              to-emerald-600 text-white font-bold rounded-lg
              shadow-lg hover:from-green-600 hover:to-emerald-700 
              focus:outline-none focus:ring-2 focus:ring-green-500
              focus:ring-offset-2  focus:ring-offset-gray-900 transition duration-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </StyledDiv>
    </>
  );
};

export default ResetPasswordPage;
