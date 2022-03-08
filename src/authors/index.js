import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFile } from "../utils/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const authorsFilePath = path.join(__dirname, "authors.json");
const router = express.Router();

// get all authors
router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// create  author
router.post("/", async (req, res, next) => {
  try {
    const { name, surname, email, dateOfBirth } = req.body;

    const author = {
      id: uniqid(),
      name,
      surname,
      email,
      dateOfBirth,
      avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fileAsBuffer = fs.readFileSync(authorsFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    fileAsJSONArray.push(author);

    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));

    res.send(author);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// get single authors
router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const author = fileAsJSONArray.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    res.send(author);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// delete  author
router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const author = fileAsJSONArray.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (author) => author.id !== req.params.id
    );
    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  update author
router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const authorIndex = fileAsJSONArray.findIndex(
      (author) => author.id === req.params.id
    );
    if (!authorIndex == -1) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    const previousAuthorData = fileAsJSONArray[authorIndex];
    const changedAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[authorIndex] = changedAuthor;

    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedAuthor);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.put(
  "/:id/avatar",
  parseFile.single("avatar"),
  async (req, res, next) => {
    try {
      const fileAsBuffer = fs.readFileSync(authorsFilePath);

      const fileAsString = fileAsBuffer.toString();

      let fileAsJSONArray = JSON.parse(fileAsString);

      const authorIndex = fileAsJSONArray.findIndex(
        (author) => author.id === req.params.id
      );
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} is not found!` });
      }
      const previousAuthorData = fileAsJSONArray[authorIndex];
      const changedAuthor = {
        ...previousAuthorData,
        avatar: req.file.path,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[authorIndex] = changedAuthor;
      fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedAuthor);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

export default router;

// import express from 'express'
// import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'
// import uniqid from 'uniqid'
// import createHttpError from 'http-errors'
// import { validationResult } from 'express-validator'
// import { newAuthorValidation } from './validation.js'
// import { getAuthors, writeAuthors } from '../lib/fs-tools.js'

// const authorsRouter = express.Router()

// // POST AUTHOR API ROUTE

// authorsRouter.post('/', newAuthorValidation, async (req, res, next) => {
//   try {
//     const errorsList = validationResult(req)
//     if (errorsList.isEmpty()) {
//       const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
//       const authorsArray = await getAuthors()
//       authorsArray.push(newAuthor)
//       writeAuthors(authorsArray)

//       res.status(201).send({ id: newAuthor.id })
//     } else {
//       next(
//         createHttpError(400, 'Some errors occurred in req body', { errorsList })
//       )
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// //MODIFY AUTHOR API ROUTE

// authorsRouter.post('/checkEmail', newAuthorValidation, async (req, res, next) => {
//   try {
//     const errorsList = validationResult(req)
//     if (errorsList.isEmpty()) {
//       const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
//       const authorsArray = await getAuthors()
//       const exist = authorsArray.some(author => author.email === req.body.email)
//       if (exist) {
//         res.status(400).send({
//           message: 'user already exists, please use another email address',
//         })
//       } else {
//         authorsArray.push(newAuthor)
//         writeAuthors(authorsArrays)
//         res.status(201).send({ id: newAuthor.id })
//       }
//     } else {
//       next(
//         createHttpError(400, 'Some errors occurred in req body', { errorsList })
//       )
//     }
//   } catch (err) {
//     next(err)
//   }
// })

// //GET ALL AUTHORS API ROUTE

// authorsRouter.get('/', async (req, res, next) => {
//   try {
//     const authors = await getAuthors()

//     if (req.query && req.query.name) {
//       const filteredAuthors = authors.filter(
//         author => author.name === req.query.name
//       )
//       res.send(filteredAuthors)
//     } else {
//       res.send(authors)
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// //GET AUTHOR API ROUTE

// authorsRouter.get('/:authorId', async (req, res, next) => {
//   try {
//     const authors = await getAuthors()
//     const author = authors.find(author => author.id === req.params.authorId)
//     if (author) {
//       res.send(author)
//     } else {
//       next(
//         createHttpError(
//           404,
//           `The author with id ${req.params.authorId} was not found!`
//         )
//       )
//     }
//   } catch (err) {
//     next(err)
//   }
// })

// //MODIFY AUTHOR

// authorsRouter.put('/:authorId', async (req, res, next) => {
//   try {
//     const authors = await getAuthors()
//     const index = authors.findIndex(author => author.id === req.params.authorId)
//     if (index !== -1) {
//       const oldAuthor = authors[index]
//       const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }
//       authors[index] = updatedAuthor
//       writeAuthors(authors)
//       res.send(updatedAuthor)
//     } else {
//       next(
//         createHttpError(404, `Author with id ${req.params.authorId} not found!`)
//       )
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// //DELETE AUTHOR API ROUTE

// authorsRouter.delete('/:authorId', async (req, res, next) => {
//   try {
//     const authors = await getAuthors()

//     const author = authors.filter(author => author.id !== req.params.authorId)

//     await writeAuthors(author)

//     res.send(author)
//   } catch (err) {
//     next(err)
//   }
// })

// export default authorsRouter
