import express from "express";
// import fs from "fs-extra";
// import { fileURLToPath } from "url";
// import { join, dirname } from "path";
import uniqid from "uniqid";
import { validationResult } from "express-validator";
import { validator } from "./validation.js";
import createHttpError from "http-errors";
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js";

const blogsRouter = express.Router();

// const blogsJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "/blogs.json"
// );

// const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));

// const writeBlogs = (content) =>
//   fs.writeFileSync(blogsJSONPath, JSON.stringify(content));

blogsRouter.post("/", validator, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const blogs = await getBlogs();
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() };
      authors.push(newBlog);
      await writeBlogs(blogs);
      res.status(201).send(newBlog);
    } else {
      next(createHttpError(400, "some errors occured", { errorsList }));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    const foundBlog = blogs.filter((blog) => blog.id === req.params.blogId);
    res.status(200).send(foundBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    const index = blogs.findIndex((blog) => blog.id === req.params.blogId);
    const oldBlog = blogs[index];
    const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
    blogs[index] = updatedBlog;
    await writeBlogs(blogs);
    res.send(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blog‚Id", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    const remainingBlogs = blogs.filter(
      (blog) => blog.id !== req.params.blogId
    );
    await writeBlogs(remainingBlogs);
    res.send(remainingBlogs);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
