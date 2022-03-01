import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'

const currentFilePath = fileURLToPath(import.meta.url)

const parentFolderPath = dirname(currentFilePath)

const authorsJSONPath = join(parentFolderPath, 'authors.json')

const authorsRouter = express.Router()

// POST AUTHOR API ROUTE

authorsRouter.post('/', (req, res) => {
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  authorsArray.push(newAuthor)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
  res.status(201).send({ id: newAuthor.id })
})

//GET ALL AUTHORS API ROUTE

authorsRouter.get('/', (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath)
  const authorsArray = JSON.parse(fileContent)
  res.send(authorsArray)
})

//GET AUTHOR API ROUTE

authorsRouter.get(':authorId', (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath)
  const authorsArray = JSON.parse(fileContent)
  const author = authorsArray.find(author => author.id === req.params.authorId)
  res.send(author)
})

export default authorsRouter

//DELETE AUTHOR API ROUTE

authorsRouter.delete(':authorId', (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath)
  const authorsArray = JSON.parse(fileContent)
  const author = authorsArray.filter(
    author => author.id !== req.params.authorId
  )
  const filteredAuthors = fs.writeFileSync(
    authorsJSONPath,
    JSON.stringify(author)
  )
  res.send(filteredAuthors)
})

//MODIFY AUTHOR API ROUTE

authorsRouter.post('/', (req, res) => {
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  authorsArray.filter(a => a.email.includes(req.body.email))
    ? res.status(400).send({
        message: 'user already exists, please use another email address',
      })
    : authorsArray.push(newAuthor)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
  res.status(201).send({ id: newAuthor.id })
})
