const express = require("express");
const postModel = require("../../data/db.js");
const router = express.Router();
const shortId = require("shortid");
const Joi = require("joi");
const errorCatch = require("../../utils/errorCatch.js");

import { Request, Response } from "express";

interface Post {
  title: string;
  contents: string;
  id?: number;
}
const postSchema = Joi.object().keys({
  title: Joi.string()
    .trim()
    .required(),
  contents: Joi.string()
    .trim()
    .max(125)
    .required()
});
console.log(postModel);
router
  .route("/")
  .get(async (req: Request, res: Response) => {
    const posts: Array<object> = await postModel.find(req.query);
    res.status(200).json(posts);
  })
  .post(async (req: Request, res: Response) => {})
  .delete(async (req: Request, res: Response) => {
    const id: string = req.body.id;
    console.log(id);
  });

router.route("/:id").get(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const foundPost = await postModel.findById(id);
  console.log(foundPost);
  if (!foundPost) {
    res.status(404).json({ errorMessage: "Cannot locate post by that ID" });
  } else {
    res.status(200).json(foundPost);
  }
});
module.exports = router;
