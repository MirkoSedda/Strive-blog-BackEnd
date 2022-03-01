import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'
import { response } from 'express'

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
  console.log('this is the body', req.body.email)
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  authorsArray.filter(a => a.email.includes(req.body.email))
    ? res.status(400).send({ message: 'user already exists' })
    : authorsArray.push(newAuthor)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))
  res.status(201).send({ id: newAuthor.id })
})

// usersRouter.put('/:userId', (request, response) => {
//   const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))
//   const index = usersArray.findIndex(user => user.id === request.params.userId)
//   const oldUser = usersArray[index]
//   const updatedUser = { ...oldUser, ...request.body, updatedAt: new Date() }
//   usersArray[index] = updatedUser
//   fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray))
//   response.send(updatedUser)
// })
