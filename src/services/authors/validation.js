import { body } from "express-validator";

export const validator = [
  body("name").exists().withMessage("Name is a mandatory field."),
  body("surname").exists().withMessage("Name is a mandatory field."),
];
