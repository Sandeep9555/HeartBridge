const express = require("express");
const http = require("http");
const path = require("path");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/messages");

const Message = require("./models/message");

const server = http.createServer(app);
const PORT = process.env.PORT || 7777;

const onlineUsers = {}; // { userId: socketId }

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", messageRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
// Socket.io Event Handlers
io.on("connection", (socket) => {
  // User goes online
  socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id;
    socket.join(userId);

    // Fetch and send undelivered messages to the user
    Message.find({ receiver: userId, delivered: false })
      .then((messages) => {
        messages.forEach((message) => {
          socket.emit("receive_message", message);
        });

        Message.updateMany(
          { receiver: userId, delivered: false },
          { $set: { delivered: true } }
        )
          .then(() => console.log(`Pending messages delivered to ${userId}`))
          .catch((err) => console.error("Error updating messages:", err));
      })
      .catch((err) =>
        console.error("Error fetching undelivered messages:", err)
      );
  });

  // Sending a message
  socket.on("send_message", async (data) => {
    const { senderId, receiverId, content, messageType } = data;

    try {
      // Prevent duplicate messages
      const existingMessage = await Message.findOne({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType,
      });

      if (existingMessage) {
        console.log("Message already exists, not saving.");
        return;
      }

      // Save the message in the database
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType,
        delivered: false,
      });

      await message.save();

      // Notify the receiver if online
      if (receiverId !== senderId && onlineUsers[receiverId]) {
        io.to(onlineUsers[receiverId]).emit("receive_message", {
          sender: senderId,
          content,
          messageType,
          createdAt: message.createdAt, // Use message timestamp
        });

        // Mark message as delivered
        await Message.findByIdAndUpdate(
          message._id,
          { delivered: true },
          { new: true }
        );
      }
    } catch (err) {
      console.error("Error in sending message:", err);
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socketId === socket.id) {
        delete onlineUsers[userId];

        break;
      }
    }
  });
});

// Database connection and server startup
connectDB()
  .then(() => {
    console.log("Database connection established...");

    server.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
