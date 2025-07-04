import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import Header from "../components/Header";
import styled from "styled-components";
import "../components/VideoBackground.css";
import Footer from "../components/Footer";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  createdAt: string | Date;
  lastLogin: string | Date;
  isVerified: boolean;
}

const StyledDiv = styled.div`
  @media screen and (max-width: 767px) {
  }
`;

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
  };

  const handleLink = async () => {
    window.location.href = "https://cartelai.autocartel.shop/";
  };
  if (user && !user.isVerified) {
    return (
      // <div className="text-center text-red-400 mt-20 text-xl font-semibold">
      //   Your email is not verified. Please check your inbox to verify.
      // </div>
      <Navigate to="/homepage" replace />
    );
  }
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full mx-auto
    mt-10 p-8 
    backdrop-filter  rounded-xl
    shadow-2xl border border-gray-800
    "
          >
            <h2
              className="text-3xl font-bold mb-6 text-center 
    bg-gradient-to-r from-green-400 to-emerald-600
    text-transparent bg-clip-text"
            >
              Dashboard
            </h2>
            <div className="space-y-6">
              <motion.div
                className="p-4 bg-gray-800 bg-opacity-50 rounded-lg
    border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3
                  className="text-xl font-semibold text-green-400
    mb-3"
                >
                  Profile Information
                </h3>
                <p className="text-gray-300">
                  {" "}
                  Name: {user ? user.name : "Not logged in"}
                </p>
                <p className="text-gray-300">
                  {" "}
                  Email: {user ? user.email : "Not logged in"}
                </p>
              </motion.div>
              <motion.div
                className="p-4 bg-gray-800 bg-opacity-50
        rounded-lg border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3
                  className="text-xl font-semibold 
        text-green-400 mb-3"
                >
                  Account Activity
                </h3>
                <p className="text-gray-300">
                  <span className="font-bold"> Joined: </span>
                  {user
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not logged in"}
                </p>
                <p className="text-gray-300">
                  <span className="font-bold"> Last Login: </span>
                  {user ? formatDate(user.lastLogin) : "Not logged in"}
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-decision-room")}
                className="button w-full py-3 px-4 bg-gradient-to-r from-green-500
       to-emerald-600 text-white font-bold rounded-lg shadow-lg
       hover:from-green-600 hover:to-emerald-700
       focus:outline-none focus:ring-2 focus:ring-green-500
       focus:ring-offset-2 focus:ring-offset-gray-900 mt-3
       "
              >
                Create Decision Room
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/all-decisions")}
                className="button w-full py-3 px-4 bg-gradient-to-r from-green-500
       to-emerald-600 text-white font-bold rounded-lg shadow-lg
       hover:from-green-600 hover:to-emerald-700
       focus:outline-none focus:ring-2 focus:ring-green-500
       focus:ring-offset-2 focus:ring-offset-gray-900 mt-3
       "
              >
                View All Votes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="button w-full py-3 px-4 bg-gradient-to-r from-green-500
       to-emerald-600 text-white font-bold rounded-lg shadow-lg
       hover:from-green-600 hover:to-emerald-700
       focus:outline-none focus:ring-2 focus:ring-green-500
       focus:ring-offset-2 focus:ring-offset-gray-900 mt-3
       "
              >
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </StyledDiv>
      <Footer />
    </>
  );
};

export default DashboardPage;
