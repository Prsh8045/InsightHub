const express = require("express");
const prisma = require("../config/db");

const router = express.Router();

async function authenticate(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const payload = require("jsonwebtoken").verify(token, process.env.JWT_SECRET || "supersecretkey");
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

router.get("/", authenticate, async (req, res) => {
    const memberships = await prisma.workspaceMember.findMany({
        where: { userId: req.userId },
        include: { workspace: true },
    });

    const workspaces = memberships.map((membership) => ({
        id: membership.workspace.id,
        name: membership.workspace.name,
        role: membership.role,
    }));

    res.json({ workspaces });
});

router.get("/:id", authenticate, async (req, res) => {
    const workspaceId = Number(req.params.id);
    const membership = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: req.userId },
        include: {
            workspace: true,
            user: true,
        },
    });

    if (!membership) return res.status(403).json({ message: "Forbidden" });

    const widgets = await prisma.widget.findMany({
        where: { workspaceId },
        orderBy: { id: "asc" },
    });

    res.json({
        workspace: {
            id: workspaceId,
            name: membership.workspace.name,
            role: membership.role,
        },
        widgets,
    });
});

module.exports = router;
