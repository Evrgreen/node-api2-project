const express = require("express");
const postModel = require("../../data/db.js");
const router = express.Router();
import { Request, Response } from "express";

router.route("/").get(async (req: Request, res: Response) => {
  const posts: Array<object> = await postModel.find(req.query);
  res.status(200).json(posts);
});

module.exports = router;
