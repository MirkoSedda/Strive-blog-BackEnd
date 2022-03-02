import { body } from 'express-validator'

export const newBlogValidation = [
  body('category').exists().withMessage('Category is a mandatory field!'),
  body('title').exists().withMessage('Title is a mandatory field!'),
  body('cover').exists().withMessage('Cover is a mandatory field!'),
  body('readTime.value').exists().withMessage('ReadTime is a mandatory field!'),
  body('readTime.unit').exists().withMessage('Unit is a mandatory field!'),
  body('author.name').exists().withMessage('Name is a mandatory field!'),
]

// users validation example -->   body("email").isEmail().withMessage("Email is not in the right format!"),
