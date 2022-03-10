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

const port = process.env.PORT;

const publicFolderPath = join(process.cwd(), "./public");

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

server.use(express.static(publicFolderPath));

server.use(
  cors({
    origin: function (origin, next) {
      // cors is a global middleware --> for each and every request we are going to be able to read the current origin value
      console.log("ORIGIN: ", origin);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        // indexOf returns -1 when the element is NOT in the array
        console.log("Origin allowed!");
        next(null, true); // origin is in the whitelist --> move next with no errors
      } else {
        console.log("Origin NOT allowed!");
        next(new Error("CORS ERROR!")); // origin is NOT in the whitelist --> trigger an error
      }
    },
  })
);
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
