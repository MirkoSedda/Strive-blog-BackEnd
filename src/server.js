import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./authors/index.js";
import blogsRouter from "./blogs/index.js";
import filesRouter from "./files/index.js";
import { errorHandler } from "./utils/errorHandlers.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectory = path.join(__dirname, "../public");
const server = express();
const { PORT } = process.env;

const whiteList = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
      callback(null, true);
    } else {
      const error = new Error("Not allowed by cors!");
      error.status = 403;
      callback(error);
    }
  },
};

server.use(cors(corsOptions));

server.use(express.json());

server.use(express.static(publicDirectory));

server.use("/authors", authorsRouter);

server.use("/blogs", blogsRouter);

server.use("/files", filesRouter)

server.use(errorHandler);

console.log(listEndpoints(server));

server.listen(PORT, () => console.log("✅ Server is running on port : ", PORT));

server.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)
);

console.table(listEndpoints(server))


// import express from 'express'
// import cors from 'cors'
// import listEndpoints from 'express-list-endpoints'
// import {
//   badRequestHandler,
//   unauthorizedHandler,
//   notFoundHandler,
//   serverErrorHandler,
// } from './errorHandlers.js'
// import { join } from 'path'
// import authorsRouter from './authors/index.js'
// import blogsRouter from './blogs/index.js'
// import filesRouter from './files/index.js'

// const server = express()

// const port = process.env.PORT

// const publicFolderPath = join(process.cwd(), "./public")

// const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

// //MIDDLEWARES

// server.use(express.static(publicFolderPath))

// server.use(cors({
//   origin: function (origin, next) {
//     console.log('origin: ' + origin)
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       console.log('origin allowed')
//       next(null, true)
//     } else {
//       console.log('origin not allowed')
//       next(new Error('cors error!'))
//     }
//   },
// }))

// server.use(express.json())

// //END POINTS

// server.use('/authors', authorsRouter)
// server.use('/blogs', blogsRouter)
// server.use('/files', filesRouter)

// //ERROR HANDLERS
// server.use(badRequestHandler)
// server.use(unauthorizedHandler)
// server.use(notFoundHandler)
// server.use(serverErrorHandler)

// //SERVER
// server.listen(port, () => {
//   console.log(`server is listening on port ${port}`)
// })

