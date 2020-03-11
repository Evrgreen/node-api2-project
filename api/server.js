"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const server = express();
const postRouter = require("./routes/post_router.js");
server.use(express.json());
server.use("/api/posts", postRouter);
server.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the user page" });
});
module.exports = server;
