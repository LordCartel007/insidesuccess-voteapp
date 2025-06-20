import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import "../components/VideoBackground.css";

type VotingOption = { id: number; value: string };

const CreateDecisionRoomPage: React.FC = () => {
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiry, setExpiry] = useState(0);

  const [votingOptions, setVotingOptions] = useState<VotingOption[]>([
    { id: 1, value: "" },
    { id: 2, value: "" },
  ]);

  console.log(expiry);

  const navigate = useNavigate();

  // Handle voting option changes
  const handleVotingOptionChange = (id: number, value: string) => {
    setVotingOptions((opts) =>
      opts.map((opt) => (opt.id === id ? { ...opt, value } : opt))
    );
  };

  // Add new voting option if less than 5
  const addVotingOption = () => {
    if (votingOptions.length < 5) {
      setVotingOptions((opts) => [...opts, { id: Date.now(), value: "" }]);
    }
  };

  // Remove voting option if more than 2
  const removeVotingOption = (id: number) => {
    if (votingOptions.length > 2) {
      setVotingOptions((opts) => opts.filter((opt) => opt.id !== id));
    }
  };

  // Submit handler
  const { createDecisionRoom, user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.email) {
      alert("Please log in to create a decision room.");
      return;
    }

    try {
      await createDecisionRoom(
        name,
        description,
        expiry,
        votingOptions,
        user.email
      );
      alert("Decision room created successfully!");
      navigate("/"); // Redirect after creation
    } catch (error) {
      console.log(error);
      alert("Failed to create decision room!");
    }
  };

  // Validation
  const canAddOption = votingOptions.length < 5;
  const canRemoveOption = votingOptions.length > 2;
  const isSubmitDisabled =
    !name ||
    !description ||
    votingOptions.some((opt) => !opt.value.trim()) ||
    votingOptions.length < 2 ||
    !expiry;

  const StyledDiv = styled.div`
    @media screen and (max-width: 767px) {
    }
  `;

  return (
    <>
      <StyledDiv className="containervideo">
        <video autoPlay loop muted playsInline className="background-clip">
          <source
            src="https://cartel-next-ecommerce.s3.eu-north-1.amazonaws.com/MAGNIFICA+-+LISA+%26+ZENDAYA+x+B.ZERO1+IN+BVLGARI'S+NEW+BRAND+CAMPAIGN+-+Bvlgari+(1080p%2C+h264).mp4"
            type="video/mp4"
          />
        </video>

        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-2">
          <form
            className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-5"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create Decision Room
            </h2>

            {/* Name */}
            <div>
              <label className="block font-semibold mb-1">Name *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter room name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1">Description *</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe the decision..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>

            {/* Voting Options */}
            <div>
              <label className="block font-semibold mb-1">
                Voting Options (2-5) *
              </label>
              <div className="space-y-2">
                {votingOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex gap-2">
                    <input
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={`Option ${idx + 1}`}
                      value={opt.value}
                      onChange={(e) =>
                        handleVotingOptionChange(opt.id, e.target.value)
                      }
                      required
                    />
                    {canRemoveOption && (
                      <button
                        type="button"
                        onClick={() => removeVotingOption(opt.id)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {canAddOption && (
                  <button
                    type="button"
                    onClick={addVotingOption}
                    className="mt-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition"
                  >
                    + Add Option
                  </button>
                )}
              </div>
            </div>

            {/* Expiry Date/Time */}
            <div>
              <label className="block font-semibold mb-1">Expiry Time *</label>

              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="number"
                placeholder="Day"
                value={expiry}
                onChange={(e) => setExpiry(Number(e.target.value))}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter, arrows
                  if (
                    [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                    ].includes(e.key)
                  ) {
                    return;
                  }
                  // Prevent: anything that's not a number
                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-3 transition"
              onClick={handleSubmit}
            >
              Create Decision Room
            </button>
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
          </form>
        </div>
      </StyledDiv>
    </>
  );
};

export default CreateDecisionRoomPage;
