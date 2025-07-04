import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./db/connectDB.js";

// importing all the routes from the auth.route.js file
import authRoutes from "./routes/auth.route.js";

const __dirname = path.resolve(); // to get the current directory name

dotenv.config();

const app = express();
const PORT = process.env.PORT || 500;

const allowedOrigins = [
  "http://localhost:5173", // or whatever your local frontend origin is
  "https://insidesuccess-voteapp.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: "https://insidesuccess-voteapp.vercel.app",
//     credentials: true,
//   })
// ); // to allow cross-origin requests

app.use(express.json()); // to parse json data from the request body
app.use(cookieParser()); // to parse cookies from the request

// Middleware to check if the database is connected
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log before trying to connect
    console.log("Attempting to connect to the database...");

    // Await the database connection
    await connectDB();

    // Log once connected
    console.log("Database connected!");

    // Proceed to the next middleware
    next();
  } catch (err) {
    // Log error if database connection fails
    console.error("Database connection failed:", err.message);
    // Handle error (e.g., return a response or stop execution)
    res
      .status(500)
      .json({ success: false, message: "Database connection failed" });
  }
});

console.log("Database connected!");

//using all the auth routes we import
app.use("/api/auth", authRoutes);

// Serve static files from the React frontend app
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   // Catch-all route to handle frontend routes (for React Router)

//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "frontend", "dist", "index.html", "assets")
//     );
//   });
// }

// console.log("Serving frontend from:", path.join(__dirname, "frontend", "dist"));

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port:", PORT);
});

// app needs to be exported for vercel to work
export default app; //for local

// module.exports = app; // for vercel compatibility
