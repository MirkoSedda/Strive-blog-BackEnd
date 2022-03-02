import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import { newAuthorValidation } from './validation.js'

const authorsRouter = express.Router()

const authorsJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'authors.json'
)

console.log(authorsJsonPath)

const getAuthor = () => JSON.parse(fs.readFileSync(authorsJsonPath))

const writeAuthor = arr =>
  fs.writeFileSync(authorsJsonPath, JSON.stringify(arr))

// POST AUTHOR API ROUTE

authorsRouter.post('/', newAuthorValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
      const authorsArray = getAuthor()
      authorsArray.push(newAuthor)
      writeAuthor(authorsArrays)

      res.status(201).send({ id: newAuthor.id })
    } else {
      next(
        createHttpError(400, 'Some errors occurred in req body', { errorsList })
      )
    }
  } catch (error) {
    next(error)
  }
})

//MODIFY AUTHOR API ROUTE

authorsRouter.post('/checkEmail', newAuthorValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
      const authorsArray = getAuthor()
      const exist = authorsArray.some(author => author.email === req.body.email)
      if (exist) {
        res.status(400).send({
          message: 'user already exists, please use another email address',
        })
      } else {
        authorsArray.push(newAuthor)
        writeAuthor(authorsArrays)
        res.status(201).send({ id: newAuthor.id })
      }
    } else {
      next(
        createHttpError(400, 'Some errors occurred in req body', { errorsList })
      )
    }
  } catch (err) {
    next(err)
  }
})

//GET ALL AUTHORS API ROUTE

authorsRouter.get('/', (req, res, next) => {
  try {
    const authors = getAuthor()

    if (req.query && req.query.name) {
      const filteredAuthors = authors.filter(
        author => author.name === req.query.name
      )
      res.send(filteredAuthors)
    } else {
      res.send(authors)
    }
  } catch (error) {
    next(error)
  }
})

//GET AUTHOR API ROUTE

authorsRouter.get('/:authorId', (req, res, next) => {
  try {
    const authors = getAuthor()
    const author = authors.find(author => author.id === req.params.authorId)
    if (author) {
      res.send(author)
    } else {
      next(
        createHttpError(
          404,
          `The author with id ${req.params.authorId} was not found!`
        )
      )
    }
  } catch (err) {
    next(err)
  }
})

//MODIFY AUTHOR

authorsRouter.put('/:authorId', (req, res, next) => {
  try {
    const authors = getAuthor()
    const index = authors.findIndex(author => author.id === req.params.authorId)
    if (index !== -1) {
      const oldAuthor = authors[index]
      const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }
      authors[index] = updatedAuthor
      writeAuthor(authors)
      res.send(updatedAuthor)
    } else {
      next(
        createHttpError(404, `Author with id ${req.params.authorId} not found!`)
      )
    }
  } catch (error) {
    next(error)
  }
})

//DELETE AUTHOR API ROUTE

authorsRouter.delete('/:authorId', (req, res, next) => {
  try {
    const authors = getAuthor()

    const author = authors.filter(author => author.id !== req.params.authorId)

    writeAuthor(author)

    res.send(author)
  } catch (err) {
    next(err)
  }
})

export default authorsRouter
