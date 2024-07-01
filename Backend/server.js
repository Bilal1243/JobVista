import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from "cookie-parser";
import connectDb from './config/db.js'
import cors from 'cors'
import path from 'path';
import { notFound, errorHandler } from './Middlewares/errorHandlers.js';
import userRoutes from './Routes/userRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import recruiterRoute from './Routes/recruiterRoutes.js';

const port = process.env.PORT || 4000
const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir);
const app = express()
connectDb()

app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser())
app.use(express.static("Backend/Public"));



app.use(cors());

app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/recruiter', recruiterRoute)

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(parentDir, "/frontend/dist")));

  // For any other route, serve the index.html file
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(parentDir, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("server is ready "));
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`server started on port ${port}`)
})

import { Server, Socket } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on('connection', (Socket) => {
  console.log('connected to socket.io')

  Socket.on("setup", (userData) => {
    Socket.join(userData._id);
    Socket.emit("connected");
  });

  Socket.on("join chat", (room) => {
    Socket.join(room);
    console.log("User Joined Room: " + room);
  });

  Socket.on('typing', (room) => Socket.in(room).emit('typing'))
  Socket.on('stop typing', (room) => Socket.in(room).emit('stop typing'))

  Socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      Socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // Handle disconnection
  Socket.off('setup', () => {
    console.log('user disconnected')
    Socket.leave(userData._id)
  })

})
