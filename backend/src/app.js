const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const widgetRoutes = require("./routes/widgetRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/widgets", widgetRoutes);

module.exports = app;