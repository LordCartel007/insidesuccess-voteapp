I used typescript as requested.

The web app contains a login with email and password using jwt and bycrpt, google signin , a vote creator and a vote , each
route is protected by the back end so any body cannot just visit.
Passwords are hashed with bcrypt, there is a password strength meter
at the frontend

When you login you get to verify your email with instant otp , there is also forgot password route , login sign in,

you also get welcome email to your inbox.
password reset email and password reset success emails are sent
automatically.

Technology Used jwt, aws s3 bucket, react vite , mongo db , mongoose, express , react google auth, tailwind , css , styledcomponent css
nodejs, reaxt toast, axios, framer-motion, lucide-react, multiparty, react, react-dom, react-hot-toast, react-router-dom, sortablejs
tailwindcss, zustand, typescript , "bcryptjs", "cookie-parser", "cors", "crypto", "dotenv", "express", "jsonwebtoken", "mailtrap", "mongoose", "nodemailer"

Taught Process

Create and store the user data on mongo db using jwt or google signin

create a dashbord that leads to Vote creating page , on going vote and vote viewer.

the each user per vote was going to be well implemented using browser finger printing , User email and local storage so only one device can vote, if email was signed in we store it to mongo db and also store cookies in local storage, to check if each user is unique

users can still vote but only once if not signed in

I could use ip address but ip address changes all the time and if two device are on the same wifi , almost

all users cannot vote since they are sharing the same ip .

The web app is not complete since now enough time, i stopped at

Mapping created votes polls for decision room.

Use npm run dev to start the web app on local host .

Hosted Link
Frontend : https://insidesuccess-voteapp.vercel.app/
Backend : https://insidesuccess-voteapp-backend.onrender.com/

Progress
