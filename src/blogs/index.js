import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import { newBlogValidation } from './validation.js'
import { getBlogs, writeBlogs } from '../lib/fs-tools.js'


const blogsRouter = express.Router()

// POST BLOG API ROUTE

blogsRouter.post('/', newBlogValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() }
      const blogArray = await getBlogs()
      blogArray.push(newBlog)
      await writeBlogs(blogArray)
      res.status(201).send({ id: newBlog.id })
    } else {
      next(
        createHttpError(400, 'Some errors occurred in req body', {
          errorsList,
        })
      )
    }
  } catch (error) {
    next(error)
  }
})

//ADD BLOG COMMENT API ROUTE

blogsRouter.post('/:blogId/comments', async (req, res, next) => {
  try {
    const blogs = await getBlogs()
    const blog = blogs.find(blog => blog.id === req.params.blogId)
    const blogComments = blog.comments.map(comment => comment)
    const updatedBlogComments = { ...blogComments, ...blogComments, updatedAt: new Date() }
    blogComments.push(updatedBlogComments)
    await writeBlogs(blogComments)
    if (blogs) {
      res.send(blogComments)
    } else {
      next(
        createHttpError(
          404,
          `The blog with id ${req.params.blogId} was not found!`
        )
      )
    }
  } catch (err) {
    next(err)
  }
})

//GET ALL BLOG API ROUTE

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await getBlogs()

    if (req.query && req.query.name) {
      const filteredBlogs = blogs.filter(blog => blog.id === req.query.id)
      res.send(filteredBlogs)
    } else {
      res.send(blogs)
    }
  } catch (error) {
    next(error)
  }
})

//GET BLOG API ROUTE

blogsRouter.get('/:blogId', async (req, res, next) => {
  try {
    const blogs = await getBlogs()
    const blog = blogs.find(blog => blog.id === req.params.blogId)
    if (blog) {
      res.send(blog)
    } else {
      next(
        createHttpError(
          404,
          `The blog with id ${req.params.blogId} was not found!`
        )
      )
    }
  } catch (err) {
    next(err)
  }
})

//GET BLOG COMMENTS API ROUTE

blogsRouter.get('/:blogId/comments', async (req, res, next) => {
  try {
    const blogs = await getBlogs()
    const blog = blogs.find(blog => blog.id === req.params.blogId)
    const comments = blog.comments.map(comment => comment)
    if (blog) {
      res.send(comments)
    } else {
      next(
        createHttpError(
          404,
          `The blog with id ${req.params.blogId} was not found!`
        )
      )
    }
  } catch (err) {
    next(err)
  }
})



//MODIFY BLOG POST

blogsRouter.put('/:blogId', async (req, res, next) => {
  try {
    const blogs = await getBlogs()
    const index = blogs.findIndex(blog => blog.id === req.params.blogId)
    if (index !== -1) {
      const oldBlog = blogs[index]
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() }
      blogs[index] = updatedBlog
      await writeBlogs(blogs)
      res.send(updatedBlog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})



//DELETE BLOG API ROUTE

blogsRouter.delete('/:blogId', async (req, res, next) => {
  try {
    const blogs = await getBlogs()

    const blog = blogs.filter(blog => blog.id !== req.params.blogId)

    writeBlogs(blog)

    res.send(blog)
  } catch (err) {
    next(err)
  }
})

export default blogsRouter
