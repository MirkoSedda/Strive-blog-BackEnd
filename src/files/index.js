import express from 'express';
import multer from 'multer'

import { saveAuthorsPictures, saveBlogsPictures } from '../lib/fs-tools.js'

const filesRouter = express.Router()

/* "authors" does need to match exactly to the property name appended to the FormData object in the frontend, 
    otherwise Multer is not going to be able to find the file in the request body*/
    
filesRouter.post("/uploadSingle", multer().single("authors"), async (req, res, next) => {
  try {
    console.log("FILE: ", req.file)
    await saveAuthorsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadMultiple", multer().array("authors"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveAuthorsPictures(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadSingle", multer().single("authors"), async (req, res, next) => {
  try {
    console.log("FILE: ", req.file)
    await saveBlogsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadMultiple", multer().array("authors"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveBlogsPictures(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default filesRouter
