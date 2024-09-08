const db = require('../database/queries');
const { body, validationResult } = require('express-validator');

const validateMessage = [
  body('title').trim()
    .isLength({ min: 1 }).withMessage('Your message must have a title'),
  body('content').trim()
    .isLength({ min: 1 }).withMessage('Your message must not be empty'),
];

const validateNewUser = [
  body('firstname').trim()
    .isLength({ min: 1 }).withMessage('Your first name must not be empty'),
  body('lastname').trim()
    .isLength({ min: 1 }).withMessage('Your last name must not be empty'),
  body('email').trim()
    .custom(async (value) => {
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [value]);

      if (user) {
        throw new Error('Email already in use');
      }
    }),
  body('password').trim()
    .isLength({ min: 8 }).withMessage('Password minimum length is 8'),
]

const index = async (req, res) => {
  const messages = await db.getAllMessages();

  res.render('index', {
    title: 'Message Board',
    messages: messages,
  })
};

const newMessageGet = async (req, res) => {
  res.render('message_form', {
    title: 'New message'
  });
};

const signUpGet = async (req, res) => {
  res.render('signup_form', {
    title: 'Sign up',
  });
};

const signUpPost = [
  validateNewUser,
  async (req, res) => {
    //TODO finish sighUpPost;
  }
];
  
const newMessagePost = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    const message = Object.assign({}, req.body);

    if (!errors.isEmpty()) {
      res.render('message_form', {
        title: 'New message',
        message: message,
        errors: errors.array(),
      });
    } else {
      //TODO Need user_id to create message, finish login & signup screen first;
      console.log('New message post successful WIP', message);

      res.redirect('/');
    }
  }
];

module.exports = {
  index,
  signUpGet,
  newMessageGet,
  newMessagePost,
}
