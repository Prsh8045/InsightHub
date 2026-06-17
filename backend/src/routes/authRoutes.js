const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

function authenticate(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);

    const { password: _, ...userData } = user;
    res.json({ user: userData });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out" });
});

router.get("/profile", authenticate, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userData } = user;
    res.json({ user: userData });
});

module.exports = router;