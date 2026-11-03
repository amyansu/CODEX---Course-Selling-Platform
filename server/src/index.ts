import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Server is running!");
});

// API Routes
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", enrollmentRoutes);

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});