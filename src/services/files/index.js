import express from "express";
import multer from "multer";
import { savedAvatars } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/uploadSingle",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      await savedAvatars(req.file.originalname, req.file.buffer);
      res.send({ message: "uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/uploadMultiple",
  multer().array("avatars"),
  async (req, res, next) => {
    try {
      const arrayOfPromises = req.files.map((file) =>
        savedAvatars(file.originalname, file.buffer)
      );
      await Promise.all(arrayOfPromises);
      res.send({ message: "uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
