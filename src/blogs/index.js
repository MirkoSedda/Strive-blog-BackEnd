import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFile } from "../utils/index.js";
import {
  checkBlogPostSchema,
  checkCommentSchema,
  checkSearchSchema,
  checkValidationResult,
} from "../utils/validation.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const blogsFilePath = path.join(__dirname, "blog.json");
const router = express.Router();

// get all blogs
router.get("/", async (req, res, next) => {
  try {
    console.log("'blogs")
    const fileAsBuffer = fs.readFileSync(blogsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get(
  "/search",
  checkSearchSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { title } = req.query;
      const fileAsBuffer = fs.readFileSync(blogsFilePath);
      const fileAsString = fileAsBuffer.toString();
      const array = JSON.parse(fileAsString);
      const filtered = array.filter((blog) =>
        blog.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(filtered);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

// create  blog
router.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const blog = {
        id: uniqid(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const fileAsBuffer = fs.readFileSync(blogsFilePath);

      const fileAsString = fileAsBuffer.toString();

      const fileAsJSONArray = JSON.parse(fileAsString);

      fileAsJSONArray.push(blog);

      fs.writeFileSync(blogsFilePath, JSON.stringify(fileAsJSONArray));

      res.send(blog);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

// get single blogs
router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogsFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const blog = fileAsJSONArray.find((blog) => blog.id === req.params.id);
    if (!blog) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
    res.send(blog);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogsFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const blog = fileAsJSONArray.find((blog) => blog.id === req.params.id);
    if (!blog) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }

    blog.comments = blog.comments || [];
    res.send(blog.comments);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// delete  blog
router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const blog = fileAsJSONArray.find((blog) => blog.id === req.params.id);
    if (!blog) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (blog) => blog.id !== req.params.id
    );
    fs.writeFileSync(blogsFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//  update blog
router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const blogIndex = fileAsJSONArray.findIndex(
      (blog) => blog.id === req.params.id
    );
    if (!blogIndex == -1) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
    const previousblogData = fileAsJSONArray[blogIndex];
    const changedblog = {
      ...previousblogData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[blogIndex] = changedblog;

    fs.writeFileSync(blogsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedblog);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put(
  "/:id/comments",
  checkCommentSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { text, userName } = req.body;
      const comment = { id: uniqid(), text, userName, createdAt: new Date() };
      const fileAsBuffer = fs.readFileSync(blogsFilePath);

      const fileAsString = fileAsBuffer.toString();

      let fileAsJSONArray = JSON.parse(fileAsString);

      const blogIndex = fileAsJSONArray.findIndex(
        (blog) => blog.id === req.params.id
      );
      if (!blogIndex == -1) {
        res
          .status(404)
          .send({ message: `blog with ${req.params.id} is not found!` });
      }
      const previousblogData = fileAsJSONArray[blogIndex];
      previousblogData.comments = previousblogData.comments || [];
      const changedblog = {
        ...previousblogData,
        ...req.body,
        comments: [...previousblogData.comments, comment],
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[blogIndex] = changedblog;

      fs.writeFileSync(blogsFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedblog);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  }
);

router.put("/:id/cover", parseFile.single("cover"), async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const blogIndex = fileAsJSONArray.findIndex(
      (blog) => blog.id === req.params.id
    );
    if (!blogIndex == -1) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
    const previousblogData = fileAsJSONArray[blogIndex];
    const changedblog = {
      ...previousblogData,
      cover: req.file.path,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[blogIndex] = changedblog;

    fs.writeFileSync(blogsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedblog);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default router;



// import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'
// import uniqid from 'uniqid'
// import createHttpError from 'http-errors'
// import { validationResult } from 'express-validator'
// import { newBlogValidation } from './validation.js'
// import { getBlogs, writeBlogs } from '../lib/fs-tools.js'


// const blogsRouter = express.Router()

// // POST BLOG API ROUTE

// blogsRouter.post('/', newBlogValidation, async (req, res, next) => {
//   try {
//     const errorsList = validationResult(req)
//     if (errorsList.isEmpty()) {
//       const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() }
//       const blogArray = await getBlogs()
//       blogArray.push(newBlog)
//       await writeBlogs(blogArray)
//       res.status(201).send({ id: newBlog.id })
//     } else {
//       next(
//         createHttpError(400, 'Some errors occurred in req body', {
//           errorsList,
//         })
//       )
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// //ADD BLOG COMMENT API ROUTE

// blogsRouter.post('/:blogId/comments', async (req, res, next) => {
//   try {
//     const blogs = await getBlogs()
//     const blog = blogs.find(blog => blog.id === req.params.blogId)
//     const blogComments = blog.comments.map(comment => comment)
//     const updatedBlogComments = { ...blogComments, ...blogComments, updatedAt: new Date() }
//     blogComments.push(updatedBlogComments)
//     await writeBlogs(blogComments)
//     if (blogs) {
//       res.send(blogComments)
//     } else {
//       next(
//         createHttpError(
//           404,
//           `The blog with id ${req.params.blogId} was not found!`
//         )
//       )
//     }
//   } catch (err) {
//     next(err)
//   }
// })

// //GET ALL BLOG API ROUTE

// blogsRouter.get('/', async (req, res, next) => {
//   try {
//     const blogs = await getBlogs()

//     if (req.query && req.query.name) {
//       const filteredBlogs = blogs.filter(blog => blog.id === req.query.id)
//       res.send(filteredBlogs)
//     } else {
//       res.send(blogs)
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// //GET BLOG API ROUTE

// blogsRouter.get('/:blogId', async (req, res, next) => {
//   try {
//     const blogs = await getBlogs()
//     const blog = blogs.find(blog => blog.id === req.params.blogId)
//     if (blog) {
//       res.send(blog)
//     } else {
//       next(
//         createHttpError(
//           404,
//           `The blog with id ${req.params.blogId} was not found!`
//         )
//       )
//     }
//   } catch (err) {
//     next(err)
//   }
// })

// //GET BLOG COMMENTS API ROUTE

// blogsRouter.get('/:blogId/comments', async (req, res, next) => {
//   try {
//     const blogs = await getBlogs()
//     const blog = blogs.find(blog => blog.id === req.params.blogId)
//     const comments = blog.comments.map(comment => comment)
//     if (blog) {
//       res.send(comments)
//     } else {
//       next(
//         createHttpError(
//           404,
//           `The blog with id ${req.params.blogId} was not found!`
//         )
//       )
//     }
//   } catch (err) {
//     next(err)
//   }
// })



// //MODIFY BLOG POST

// blogsRouter.put('/:blogId', async (req, res, next) => {
//   try {
//     const blogs = await getBlogs()
//     const index = blogs.findIndex(blog => blog.id === req.params.blogId)
//     if (index !== -1) {
//       const oldBlog = blogs[index]
//       const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() }
//       blogs[index] = updatedBlog
//       await writeBlogs(blogs)
//       res.send(updatedBlog)
//     } else {
//       next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
//     }
//   } catch (error) {
//     next(error)
//   }
// })



// //DELETE BLOG API ROUTE

// blogsRouter.delete('/:blogId', async (req, res, next) => {
//   try {
//     const blogs = await getBlogs()

//     const blog = blogs.filter(blog => blog.id !== req.params.blogId)

//     writeBlogs(blog)

//     res.send(blog)
//   } catch (err) {
//     next(err)
//   }
// })

// export default blogsRouter
