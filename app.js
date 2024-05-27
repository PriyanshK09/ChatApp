// external imports / dependencies
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const http = require('http');

const socketIo = require('socket.io');

// middlewares
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

// routes / routers
const loginRouter = require("./routes/loginRouter");
const signupRouter = require("./routes/signupRouter");
const usersRouter = require("./routes/usersRouter");
const inboxRouter = require("./routes/inboxRouter");

const app = express();
dotenv.config();

// Socket.IO setup
const server = http.createServer(app);
const io = socketIo(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages
  socket.on('chat message', (msg) => {
    console.log('Message received: ' + msg);
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.locals.moment = moment;

const port = process.env.PORT;
const mongoConnectionString = process.env.MONGO_URL;

// application config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.set("view engine", "ejs");

// database connection
mongoose
  .connect(mongoConnectionString)
  .then(() => console.log("-> database connection successful"))
  .catch((err) => console.log(err.message || err));

// for rendering the login page and handling the login related stuffs
app.use("/", loginRouter);
// for rendering the signup page and handling the signup related stuffs
app.use("/signup", signupRouter);
// for rendering the signup page and handling the users related stuffs
app.use("/users", usersRouter);
// for rendering the inbox page and handling the inbox related stuffs
app.use("/inbox", inboxRouter);

// * error handlings
app.use(notFoundHandler);
app.use(errorHandler);

// staring the server
server.listen(port, () => console.log(`-> listening to port [${port}]`));
