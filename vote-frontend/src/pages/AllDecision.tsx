import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import Header from "../components/Header";
import styled from "styled-components";
import "../components/VideoBackground.css";
import Footer from "../components/Footer";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

interface Decision {
  _id: string;
  decisionname: string;
  decisiondescription: string;
  decisionoptions: string[];
  decisionvoteCount: number;
  decisionexpiryTime: string;
  createdAt: string;
  updatedAt: string;
  // add other fields as needed
}

interface UserWithDecisions {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  isVerified: boolean;
  decisions: Decision[];
}

const StyledDiv = styled.div`
  @media screen and (max-width: 767px) {
  }
`;

const AllDecisionPage: React.FC = () => {
  const { user, logout, allUsers, fetchUsers } = useAuthStore();
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogout = async () => {
    logout();
  };

  const handleLink = async () => {
    window.location.href = "https://cartelai.autocartel.shop/";
  };

  if (user && !user.isVerified) {
    return <Navigate to="/homepage" replace />;
  }

  // 1. Find the current user in allUsers by email (case-insensitive)
  const matchedUser: UserWithDecisions | undefined = allUsers?.find(
    (u: any) => u.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  // 2. Get their decisions, or empty array if none
  const userDecisions: Decision[] = matchedUser?.decisions || [];

  // 3. Get the selected decision object if any
  const selectedDecision = userDecisions.find(
    (d) => d._id === selectedDecisionId
  );

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
            className="max-w-md w-full mx-auto mt-10 p-8 
            backdrop-filter  rounded-xl shadow-2xl border border-gray-800"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
              All Votes Ever
            </h2>
            <div className="space-y-6">
              {/* Profile */}
              <motion.div
                className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-green-400 mb-3">
                  Profile Information
                </h3>
                <p className="text-gray-300">
                  Name: {user ? user.name : "Not logged in"}
                </p>
                <p className="text-gray-300">
                  Email: {user ? user.email : "Not logged in"}
                </p>
              </motion.div>
              {/* Activity */}
              <motion.div
                className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* <h3 className="text-xl font-semibold text-green-400 mb-3">
                  Account Activity
                </h3>
                <p className="text-gray-300">
                  <span className="font-bold">Joined: </span>
                  {user
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not logged in"}
                </p> */}
                <p className="text-gray-300">
                  <span className="font-bold">Last Login: </span>
                  {user ? formatDate(user.lastLogin) : "Not logged in"}
                </p>
              </motion.div>
            </div>
            {/* Decisions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Your Decisions
              </h3>
              {userDecisions.length > 0 ? (
                <ul>
                  {userDecisions.map((decision) => (
                    <li
                      key={decision._id}
                      className="mb-2 cursor-pointer text-green-300 hover:text-green-500"
                      onClick={() =>
                        setSelectedDecisionId(
                          selectedDecisionId === decision._id
                            ? null
                            : decision._id
                        )
                      }
                    >
                      <span className="underline">{decision.decisionname}</span>
                      {/* Show details if this decision is selected */}
                      {selectedDecisionId === decision._id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-700 mt-2 rounded-lg p-3 text-gray-200"
                        >
                          <div>
                            <strong>ID:</strong> {decision._id}
                          </div>
                          <div>
                            <strong>Description:</strong>{" "}
                            {decision.decisiondescription}
                          </div>
                          <div>
                            <strong>Options:</strong>{" "}
                            {decision.decisionoptions.join(", ")}
                          </div>
                          <div>
                            <strong>Vote Count:</strong>{" "}
                            {decision.decisionvoteCount}
                          </div>
                          <div>
                            <strong>Expiry:</strong>{" "}
                            {new Date(
                              decision.decisionexpiryTime
                            ).toLocaleString()}
                          </div>
                          <div>
                            <strong>Created:</strong>{" "}
                            {new Date(decision.createdAt).toLocaleString()}
                          </div>
                        </motion.div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">
                  No decisions found for this user.
                </div>
              )}
            </motion.div>
            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
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
                focus:ring-offset-2 focus:ring-offset-gray-900 mt-3"
              >
                Create Decision Room
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="button w-full py-3 px-4 bg-gradient-to-r from-green-500
                to-emerald-600 text-white font-bold rounded-lg shadow-lg
                hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-2 focus:ring-green-500
                focus:ring-offset-2 focus:ring-offset-gray-900 mt-3"
              >
                View DashBoard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="button w-full py-3 px-4 bg-gradient-to-r from-green-500
                to-emerald-600 text-white font-bold rounded-lg shadow-lg
                hover:from-green-600 hover:to-emerald-700
                focus:outline-none focus:ring-2 focus:ring-green-500
                focus:ring-offset-2 focus:ring-offset-gray-900 mt-3"
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

export default AllDecisionPage;
