require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("joinWorkspace", (workspaceId) => {
        socket.join(`workspace:${workspaceId}`);
    });

    socket.on("leaveWorkspace", (workspaceId) => {
        socket.leave(`workspace:${workspaceId}`);
    });

    socket.on("workspaceUpdate", (payload) => {
        const room = `workspace:${payload.workspaceId}`;
        socket.to(room).emit("workspaceUpdate", payload);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected", socket.id);
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server running on ${port}`);
});