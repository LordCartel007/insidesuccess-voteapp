import mongoose from "mongoose";

// Define the shape of a single decision
interface Decision {
  decisionname: string;
  decisiondescription: string;
  decisionoptions: string[];
  decisionvoteCount: number;
  decisionexpiryTime: Date;
}

interface UserModel extends Document {
  email: string;
  password?: string; // Optional for OAuth users
  name: string;
  picture?: string; // Optional, mostly used by Google users
  lastLogin: Date;
  isVerified: boolean;
  provider: string;
  resetPasswordToken: string;
  verificationToken: String;
  resetPasswordExpiresAt: Date;
  verificationTokenExpiresAt: Date;
  decisions: Decision[];
}

const decisionSchema = new mongoose.Schema(
  {
    decisionname: {
      type: String,
      required: true,
      trim: true,
    },
    decisiondescription: {
      type: String,
      required: true,
    },

    decisionoptions: {
      type: [String],
      validate: {
        validator: function (value: string[]) {
          return value.length >= 2 && value.length <= 5;
        },
        message: "Options must have between 2 and 5 items.",
      },
      required: true,
    },
    decisionvoteCount: {
      type: Number,
      default: 0,
    },
    decisionexpiryTime: {
      type: Number,
      required: true,
    },
  },
  { _id: true, timestamps: true } // Allow unique IDs per decision
);

const userSchema = new mongoose.Schema<UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Only required if the provider is "credentials"
      required: function () {
        return this.provider === "credentials";
      },
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String, // Optional, mostly used by Google users
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    decisions: [decisionSchema],

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
