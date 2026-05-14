import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json())
app.use(cors({
    origin: ['https://www.moshiurrahman.online', 'http://localhost:3000'],
}));


// import routes
import { connectDB } from "./database/db.js";
import contact from "./routes/contactRoutes/contact.js";
import blogsRoute from "./routes/blogRoutes/blogs.js";


await connectDB();


// apis
app.use("/api/contacts", contact)
app.use("/api/blogs", blogsRoute)

app.get("/", (req, res) => {
    res.send("Moshiur.dev server is running rapidly")
})

app.listen(port, () => {
    console.log(`moshiur server running on port http://localhost:${port}`);
})