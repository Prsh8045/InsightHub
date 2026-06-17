require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./config/db");

async function main() {
    const passwordHash = await bcrypt.hash("password", 10);

    const alice = await prisma.user.upsert({
        where: { email: "alice@example.com" },
        update: {},
        create: {
            name: "Alice Admin",
            email: "alice@example.com",
            password: passwordHash,
            role: "ADMIN",
        },
    });

    const bob = await prisma.user.upsert({
        where: { email: "bob@example.com" },
        update: {},
        create: {
            name: "Bob Analyst",
            email: "bob@example.com",
            password: passwordHash,
            role: "ANALYST",
        },
    });

    const carol = await prisma.user.upsert({
        where: { email: "carol@example.com" },
        update: {},
        create: {
            name: "Carol Viewer",
            email: "carol@example.com",
            password: passwordHash,
            role: "VIEWER",
        },
    });

    const workspace = await prisma.workspace.upsert({
        where: { name: "Sales Dashboard" },
        update: {},
        create: {
            name: "Sales Dashboard",
            createdBy: alice.id,
        },
    });

    await prisma.workspaceMember.upsert({
        where: { workspaceId_userId: { workspaceId: workspace.id, userId: alice.id } },
        update: {},
        create: {
            workspaceId: workspace.id,
            userId: alice.id,
            role: "ADMIN",
        },
    });

    await prisma.workspaceMember.upsert({
        where: { workspaceId_userId: { workspaceId: workspace.id, userId: bob.id } },
        update: {},
        create: {
            workspaceId: workspace.id,
            userId: bob.id,
            role: "ANALYST",
        },
    });

    await prisma.workspaceMember.upsert({
        where: { workspaceId_userId: { workspaceId: workspace.id, userId: carol.id } },
        update: {},
        create: {
            workspaceId: workspace.id,
            userId: carol.id,
            role: "VIEWER",
        },
    });

    console.log("Seed complete");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
