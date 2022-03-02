import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import { newBlogValidation } from './validation.js'

const blogsRouter = express.Router()

const blogsJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'blogs.json'
)

const getBlog = () => JSON.parse(fs.readFileSync(blogsJsonPath))

const writeBlog = arr => fs.writeFileSync(blogsJsonPath, JSON.stringify(arr))

// POST BLOG API ROUTE

blogsRouter.post('/', newBlogValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() }
      const blogArray = getBlog()
      blogArray.push(newBlog)
      writeBlog(blogArray)
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

//MODIFY BLOG API ROUTE

//GET ALL BLOG API ROUTE

blogsRouter.get('/', (req, res, next) => {
  try {
    const blogs = getBlog()

    if (req.query && req.query.name) {
      const filteredBlogs = blogs.filter(blog => blog.id === req.query._id)
      res.send(filteredBlogs)
    } else {
      res.send(blogs)
    }
  } catch (error) {
    next(error)
  }
})

//GET BLOG API ROUTE

blogsRouter.get('/:blogId', (req, res, next) => {
  try {
    const blogs = getBlog()
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

//MODIFY BLOG

blogsRouter.put('/:blogId', (req, res, next) => {
  try {
    const blogs = getBlog()
    const index = blogs.findIndex(blog => blog.id === req.params.blogId)
    if (index !== -1) {
      const oldBlog = blogs[index]
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() }
      blogs[index] = updatedBlog
      writeBlog(blogs)
      res.send(updatedBlog)
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

//DELETE BLOG API ROUTE

blogsRouter.delete('/:blogId', (req, res, next) => {
  try {
    const blogs = getBlog()

    const blog = blogs.filter(blog => blog.id !== req.params.blogId)

    writeBlog(blog)

    res.send(blog)
  } catch (err) {
    next(err)
  }
})

export default blogsRouter
