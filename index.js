import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// security headers
app.use(helmet());

// Apply rate limiter to all requests
app.use(apiLimiter);

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: ['https://www.moshiurrahman.online', 'http://localhost:3000'],
}));


// import routes
import { connectDB } from "./database/db.js";
import contact from "./routes/contactRoutes/contact.js";
import blogsRoute from "./routes/blogRoutes/blogs.js";
import profileRoute from "./routes/profileRoutes/profile.js";


await connectDB();


// apis
app.use("/api/contacts", contact)
app.use("/api/blogs", blogsRoute)
app.use("/api/profile", profileRoute);

app.get("/", (req, res) => {
    res.send("Moshiur.dev server is running rapidly")
})

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`moshiur server running on port http://localhost:${port}`);
})
