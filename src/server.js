import express from "express";
import { join } from "path";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./services/authors/index.js";
import blogsRouter from "./services/blogs/index.js";
import cors from "cors";
import {
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
} from "./errorhandlers.js";

import filesRouter from "./services/files/index.js";

const server = express();

const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

server.use(cors());
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogs", blogsRouter);
server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("server is running on port" + port);
});
