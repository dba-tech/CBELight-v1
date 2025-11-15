require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: "https://cbelight.vercel.app"
}));
app.use(express.json());
app.get("/", (req, res) => res.send("CBELight API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/users", userRoutes);

// start server only when run directly (skip when imported by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const http = require('http');
  const { Server } = require('socket.io');

  connectDB().then(() => {
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });
    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('Socket connected', socket.id);
    });

    server.listen(PORT, () => console.log(`🚀 API http://localhost:${PORT}`));
  }).catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

module.exports = app; 