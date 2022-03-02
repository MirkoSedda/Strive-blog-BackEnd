import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  serverErrorHandler,
} from './errorHandlers.js'
import authorsRouter from './authors/index.js'
import blogsRouter from './blogs/index.js'

const server = express()

const port = 3001

//MIDDLEWARES

server.use(cors())

server.use(express.json())

//END POINTS

server.use('/authors', authorsRouter)
server.use('/blogs', blogsRouter)

//ERROR HANDLERS
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(serverErrorHandler)

//SERVER
server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})

console.table(listEndpoints(server))
