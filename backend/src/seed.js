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

    // Clear existing widgets
    await prisma.widget.deleteMany({});

    // Seed default widgets
    const widgetsData = [
        {
            workspaceId: workspace.id,
            title: "Monthly Sales Revenue",
            type: "LINE",
            config: {
                xKey: "name",
                yKey: "value",
                color: "#1890ff"
            },
            layout: { x: 0, y: 0, w: 6, h: 6 },
            pinned: true,
        },
        {
            workspaceId: workspace.id,
            title: "Quarterly Acquisitions",
            type: "BAR",
            config: {
                xKey: "name",
                yKey: "value",
                color: "#52c41a"
            },
            layout: { x: 6, y: 0, w: 6, h: 6 },
            pinned: false,
        },
        {
            workspaceId: workspace.id,
            title: "User Conversion Rate",
            type: "KPI",
            config: {
                title: "Conversion Rate",
                value: 82.4,
                change: 4.8,
                prefix: "",
                suffix: "%",
                description: "Proportion of active users converting to paying customers."
            },
            layout: { x: 0, y: 6, w: 4, h: 5 },
            pinned: true,
        },
        {
            workspaceId: workspace.id,
            title: "Enterprise Client Status",
            type: "TABLE",
            config: {
                columns: [
                    { title: "Company", dataIndex: "company", key: "company" },
                    { title: "Plan", dataIndex: "plan", key: "plan" },
                    { title: "Usage", dataIndex: "usage", key: "usage" },
                    { title: "Status", dataIndex: "status", key: "status" }
                ],
                rows: [
                    { id: 1, company: "Acme Corp", plan: "Enterprise", usage: "92%", status: "Active" },
                    { id: 2, company: "Brightloop", plan: "Growth", usage: "64%", status: "Active" },
                    { id: 3, company: "Nova Studio", plan: "Enterprise", usage: "45%", status: "Pending" },
                    { id: 4, company: "Luna Tech", plan: "Free", usage: "12%", status: "Inactive" }
                ]
            },
            layout: { x: 4, y: 6, w: 8, h: 5 },
            pinned: false,
        }
    ];

    for (const widgetData of widgetsData) {
        await prisma.widget.create({ data: widgetData });
    }

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
