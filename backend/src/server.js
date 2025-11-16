require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ Define allowed origins based on environment
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN, // e.g., https://cblight.vercel.app
  "http://localhost:5173"
];

// ✅ Apply unified CORS config
app.use(cors({
  origin: allowedOrigins,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => res.send("CBELight API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/users", userRoutes);

// ✅ Start server only when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const http = require('http');
  const { Server } = require('socket.io');

  connectDB().then(() => {
    const server = http.createServer(app);

    // ✅ Socket.io uses same CORS config
    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('Socket connected', socket.id);
    });

    server.listen(PORT, () => {
      console.log(`🚀 API running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

module.exports = app;