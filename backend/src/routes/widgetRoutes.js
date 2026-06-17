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

function hasWorkspacePermission(role) {
    return ["ADMIN", "ANALYST"].includes(role);
}

router.put("/:id", authenticate, async (req, res) => {
    const widgetId = Number(req.params.id);
    const { config, layout, pinned } = req.body;

    const widget = await prisma.widget.findUnique({
        where: { id: widgetId },
        include: { workspace: { include: { members: true } } },
    });

    if (!widget) return res.status(404).json({ message: "Widget not found" });

    const membership = widget.workspace.members.find((member) => member.userId === req.userId);
    if (!membership || !hasWorkspacePermission(membership.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const updatedWidget = await prisma.widget.update({
        where: { id: widgetId },
        data: {
            config: config ?? widget.config,
            layout: layout ?? widget.layout,
            pinned: pinned ?? widget.pinned,
        },
    });

    res.json({ widget: updatedWidget });
});

module.exports = router;
