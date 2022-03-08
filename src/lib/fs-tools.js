// import fs from 'fs-extra';
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path';

// const { readJSON, writeJSON, writeFile } = fs

// const getJSONPath = filename => join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename)


// const authorsJSONPath = getJSONPath("authors.json")
// const blogsJSONPath = getJSONPath("blogs.json")

// const authorsPublicFolderPath = join(process.cwd(), "./public/authors")
// const blogsPublicFolderPath = join(process.cwd(), "./public/blogs")

// export const getAuthors = () => readJSON(authorsJSONPath)
// export const writeAuthors = content => writeJSON(authorsJSONPath, content)

// export const getBlogs = () => readJSON(blogsJSONPath)
// export const writeBlogs = content => writeJSON(blogsJSONPath, content)

// export const saveAuthorsPictures = (filename, contentAsABuffer) => writeFile(join(authorsPublicFolderPath, filename), contentAsABuffer)
// export const saveBlogsPictures = (filename, contentAsABuffer) => writeFile(join(blogsPublicFolderPath, filename), contentAsABuffer)
