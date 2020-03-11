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
  .post(async (req: Request, res: Response) => {
    try {
      const sentPost: Post = req.body;
      if (!sentPost || !sentPost.title || !sentPost.contents) {
        console.log("no post info");
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post"
        });
      } else {
        sentPost.id = shortId.generate();
        const newPost = await postModel.insert(sentPost);
        res.status(200).json(newPost);
      }
    } catch (error) {
      res
        .status(500)
        .json({ errorMessage: "There was an error updating your post" });
    }
  })
  .delete(async (req: Request, res: Response) => {
    const id: string = req.body.id;
    console.log(id);
  });

router
  .route("/:id")
  .get(async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const foundPost = await postModel.findById(id);
    console.log(foundPost);
    if (!foundPost) {
      res.status(404).json({ errorMessage: "Cannot locate post by that ID" });
    } else {
      res.status(200).json(foundPost);
    }
  })
  .delete(async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const foundItem = await postModel.findById(id);
      if (foundItem.length) {
        postModel.remove(id);

        res.status(200).json(foundItem);
      } else {
        res
          .status(404)
          .json({ errorMessage: "Could not find a Post with that Id" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ errorMessage: "There was an error deleting that user" });
    }
  })
  .put(async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const sentPost: Post = req.body;
    if (!sentPost) {
      console.log("no sent post");
      res
        .status(404)
        .json({ errorMessage: "The post with that ID does not exist" });
    } else {
      try {
        if (!sentPost.title || !sentPost.contents) {
          console.log("no post info");
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post"
          });
        } else {
          await postModel.update(id, sentPost);
          const newPost = await postModel.findById(id);
          res.status(200).json(newPost);
        }
      } catch (error) {
        res
          .status(500)
          .json({ errorMessage: "There was an error updating your post" });
      }
    }
  });

//Router endpoints for post comments
router.route("/:id/comments").get(async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const queriedPost = await postModel.findById(id);
  console.log(queriedPost);
  console.log(!queriedPost);
  //   if (!queriedPost) {
  //     res
  //       .status(404)
  //       .json({ errorMessage: "The post with the that ID does not exist" });
  //   } else {
  //   try {
  console.log("looking for comments");
  const commentPost: Array<object> = await postModel.findPostComments(id);
  if (!commentPost || commentPost.length < 1) {
    res.status(400).json({
      errorMessage: "Was not able to find any comments for that post"
    });
  } else {
    res.status(200).json(commentPost);
  }
  //   } catch (error) {
  //     res.status(500).json({
  //       errorMessage: "There was an error getting comments",
  //       error: error
  //     });
  //   }
});
module.exports = router;
