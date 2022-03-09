import { body } from "express-validator";

export const validator = [
  body("category").exists().withMessage("Name is a mandatory field."),
  body("title").exists().withMessage("Name is a mandatory field."),
  body("cover").exists().withMessage("Name is a mandatory field."),
  body("author.name").exists().withMessage("Name is a mandatory field."),
  body("author.avatar").exists().withMessage("Name is a mandatory field."),
];
