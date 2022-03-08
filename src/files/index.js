import express from 'express';
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import createHttpError from 'http-errors'

import { saveAuthorsPictures, saveBlogsPictures, getAuthors, writeAuthors, getBlogs, writeBlogs } from '../lib/fs-tools.js'

const filesRouter = express.Router()

const cloudinaryAuthorUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "author"
    },
  }),
}).single("author")

const cloudinaryBlogUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "blog"
    },
  }),
}).single("blog")

/* "author and blog" needs to match exactly to the property name appended to the FormData object in the frontend, 
    otherwise Multer is not going to be able to find the file in the request body*/

filesRouter.post("/authors/:id/uploadAvatar", multer().single("author"), async (req, res, next) => {
  try {
    console.log("FILE: ", req.file)
    await saveAuthorsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/authors/:id/cloudinaryUpload", cloudinaryAuthorUploader, async (req, res, next) => {
  try {
    console.log(req.file)
    const authors = await getAuthors()
    console.log(authors)

    const index = authors.findIndex(author => author.id === req.params.id)

    if (index !== -1) {

      const oldAuthor = authors[index]

      const updatedAuthor = { ...oldAuthor, avatar: req.file.path }

      authors[index] = updatedAuthor

      console.log(authors)
      await writeAuthors(authors)

      res.send("Uploaded authors on Cloudinary!")
    } else {
      next(createHttpError(404))
    }
  } catch (error) {
    next(error)
  }
})


filesRouter.post("/blogPosts/:id/uploadCover", multer().single("blog"), async (req, res, next) => {
  try {
    console.log("FILE: ", req.file)
    await saveBlogsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/blogs/:id/cloudinaryUpload", cloudinaryBlogUploader, async (req, res, next) => {
  try {
    console.log(req.file)
    const blogs = await getBlogs()
    console.log(blogs)

    const index = blogs.findIndex(blog => blog.id === req.params.id)

    if (index !== -1) {

      const oldBlog = blogs[index]

      const updatedBlog = { ...oldBlog, cover: req.file.path }

      blogs[index] = updatedBlog

      console.log(blogs)
      await writeBlogs(blogs)

      res.send("Uploaded blogs on Cloudinary!")
    } else {
      next(createHttpError(404))
    }
  } catch (error) {
    next(error)
  }
})


// ------------------------------------

// filesRouter.post("/uploadMultiple", multer().array("authors"), async (req, res, next) => {
//   try {
//     console.log("FILES: ", req.files)
//     const arrayOfPromises = req.files.map(file => saveAuthorsPictures(file.originalname, file.buffer))
//     await Promise.all(arrayOfPromises)
//     res.send()
//   } catch (error) {
//     next(error)
//   }
// })


// filesRouter.post("/uploadMultiple", multer().array("authors"), async (req, res, next) => {
//   try {
//     console.log("FILES: ", req.files)
//     const arrayOfPromises = req.files.map(file => saveBlogsPictures(file.originalname, file.buffer))
//     await Promise.all(arrayOfPromises)
//     res.send()
//   } catch (error) {
//     next(error)
//   }
// })

export default filesRouter
