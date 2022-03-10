import { checkSchema, validationResult } from "express-validator";

const schema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category validation failed , type must be  string ",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "content validation failed , type must be string ",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "author.name validation failed , type must be string",
    },
  },
  "author.avatar": {
    in: ["body"],
    isString: {
      errorMessage: "author.avatar validation failed , type must be string",
    },
  },
  "readTime.value": {
    in: ["body"],
    isNumeric: {
      errorMessage: "readTime.value  validation failed , type must be numeric ",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "readTime.unit  validation failed , type must be string ",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "cover validation failed , type must be string",
    },
  },
};

const searchSchema = {
  title: {
    in: ["query"],
    isString: {
      errorMessage:
        "title must be in query and type must be  string to search!",
    },
  },
};

const commentSchema = {
  text: {
    isString: {
      errorMessage: "Text field is required for comment",
    },
  },
  userName: {
    isString: {
      errorMessage: "User name is required for comment",
    },
  },
};

export const checkCommentSchema = checkSchema(commentSchema);

export const checkSearchSchema = checkSchema(searchSchema);

export const checkBlogPostSchema = checkSchema(schema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Blog post validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};


// import { body } from 'express-validator'

// export const newBlogValidation = [
//   body('category').exists().withMessage('Category is a mandatory field!'),
//   body('title').exists().withMessage('Title is a mandatory field!'),
//   body('cover').exists().withMessage('Cover is a mandatory field!'),
//   body('readTime.value').exists().withMessage('ReadTime is a mandatory field!'),
//   body('readTime.unit').exists().withMessage('Unit is a mandatory field!'),
//   body('author.name').exists().withMessage('Name is a mandatory field!'),
// ]

// users validation example -->   body("email").isEmail().withMessage("Email is not in the right format!")


// import { body } from 'express-validator'

// export const newAuthorValidation = [
//   body('name').exists().withMessage('Name is a mandatory field!'),
//   body('surname').exists().withMessage('Surname is a mandatory field!'),
//   body('email').isEmail().withMessage('Email is a mandatory field!'),
// body('date-of-birth').exists().withMessage('Date is a mandatory field!'),
// ]

// users validation example -->   body("email").isEmail().withMessage("Email is not in the right format!")

