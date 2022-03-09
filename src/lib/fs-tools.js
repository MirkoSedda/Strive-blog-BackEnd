import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const authorsJSONPath = join(dataFolderPath, "authors.json");
const blogsJSONPath = join(dataFolderPath, "blogs.json");

const publicPath = join(process.cwd(), "./public/img");

export const getAuthors = () => readJSON(authorsJSONPath);
export const getBlogs = () => readJSON(blogsJSONPath);

export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);
export const writeBlogs = (content) => writeJSON(blogsJSONPath, content);

export const savedAvatars = (filename, contentAsABuffer) => writeFile(join(publicPath, filename), contentAsABuffer);
