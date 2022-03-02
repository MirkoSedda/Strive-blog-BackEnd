import { body } from 'express-validator'

export const newAuthorValidation = [
  body('name').exists().withMessage('Name is a mandatory field!'),
  body('surname').exists().withMessage('Surname is a mandatory field!'),
  body('email').isEmail().withMessage('Email is a mandatory field!'),
  body('date-of-birth').isDate().withMessage('Email is a mandatory field!'),
]

// users validation example -->   body("email").isEmail().withMessage("Email is not in the right format!"),
