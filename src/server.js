require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${
  process.env.DB_HOST
}/omnistack?retryWrites=true`;

mongoose.connect(db, { useNewUrlParser: true });

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.resolve(__dirname, "..", "temp")));

app.use(require("./routes"));

server.listen("3333");
