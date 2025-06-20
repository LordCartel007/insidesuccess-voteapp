import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/auth";
const API_URL_TWO = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true; // to send cookies with requests

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

interface User {
  email: string;
  name: string;
  _id: string;
  [key: string]: any;
  createdAt: string;
  lastLogin: string;
  isVerified: boolean;
  decisions: Decision[];
}

interface AuthStore {
  allUsers: User[] | null; // <-- add this
  fetchUsers: () => Promise<void>; // <-- add this
  user: User | null;
  isAuthenticated: boolean;

  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<any>;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  googlelogin: (email: string, name: string, picture?: string) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  createDecisionRoom: (
    name: string,
    description: string,
    expiry: number,
    votingOptions: VotingOption[],
    email: string
  ) => Promise<void>;
  success: boolean;
}

type VotingOption = { id: number; value: string };

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  success: false,
  allUsers: [],

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  //checking if user is verified
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{
        message?: string;
        redirectToVerify?: boolean;
      }>;
      if (error.response?.data?.redirectToVerify) {
        return { redirectToVerify: true };
      } else {
        set({
          error: error.response?.data?.message || "Error logging in",
          isLoading: false,
        });
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
  },

  googlelogin: async (email, name, picture) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/google-login`, {
        email,
        name,
        picture,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError<{
        message?: string;
        redirectToVerify?: boolean;
      }>;
      if (error.response?.data?.redirectToVerify) {
        return { redirectToVerify: true };
      } else {
        set({
          error: error.response?.data?.message || "Error logging in",
          isLoading: false,
        });
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL_TWO}/reset-password/${token}`,
        {
          password,
        }
      );
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  fetchUsers: async () => {
    try {
      const res = await axios.get<{ success: boolean; users: User[] }>(
        `${API_URL}/userFetcher`
      );
      if (res.data.success) {
        set({ allUsers: res.data.users });
      } else {
        set({ allUsers: null });
      }
    } catch (error) {
      set({ allUsers: null });
    }
  },

  createDecisionRoom: async (
    name: string,
    description: string,
    expiry: number,
    votingOptions: { id: number; value: string }[],
    email: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/createDecisionRoom`, {
        name,
        description,
        expiry,
        votingOptions: votingOptions.map((opt: any) => opt.value),
        email,
      });
      set({ isLoading: false, error: null });
      toast.success("Decision room created!");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Error creating decision room",
        isLoading: false,
        success: false,
      });
      toast.error(
        error.response?.data?.message || "Error creating decision room"
      );
      throw error;
    }
  },
}));
