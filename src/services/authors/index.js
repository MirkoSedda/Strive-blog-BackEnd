import express from "express";
// import fs from "fs-extra";
// import { fileURLToPath } from "url";
// import { join, dirname } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { validator } from "./validation.js";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const authorsRouter = express.Router();

// const authorsJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "/authors.json"
// );

// const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath));

// const writeAuthors = (content) =>
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(content));

authorsRouter.post("/", validator, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const authors = await getAuthors();
      const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
      authors.push(newAuthor);
      await writeAuthors(authors);
      res.status(201).send(newAuthor);
    } else {
      next(createHttpError(400, "some errors occured", { errorsList }));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const foundAuthor = authors.filter(
      (author) => author.id === req.params.authorId
    );
    res.status(200).send(foundAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const index = authors.findIndex(
      (author) => author.id === req.params.authorId
    );
    const oldAuthor = authors[index];
    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
    authors[index] = updatedAuthor;
    await writeAuthors(authors);
    res.send(updatedAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const remainingAuthors = authors.filter(
      (author) => author.id !== req.params.authorId
    );
    await writeAuthors(remainingAuthors);
    res.send(remainingAuthors);
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
