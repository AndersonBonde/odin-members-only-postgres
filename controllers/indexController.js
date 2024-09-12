require('dotenv').config();

const { body, validationResult } = require('express-validator');
const db = require('../database/queries');
const bcrypt = require('bcryptjs');
const passport = require('passport');

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
      const user = await db.findUserByEmail(value);

      if (user) {
        throw new Error('Email already in use');
      }
    }),
  body('password').trim()
    .isLength({ min: 3 }).withMessage('Password minimum length is 3'),
  body('password_confirm').trim()
    .custom((value, { req }) => {
      return req.body.password === value;
    }).withMessage(`Password and password confirm didn't match`),
]

const index = async (req, res) => {
  const messages = await db.getAllMessages();

  res.render('index', {
    title: 'Message Board',
    messages: messages,
    user: req.user,
  })
};

const signUpGet = async (req, res) => {
  res.render('signup_form', {
    title: 'Sign up',
  });
};

const signUpPost = [
  validateNewUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    const info = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email };

    if (!errors.isEmpty()) {
      res.render('signup_form', {
        title: 'Sign up',
        info: info,
        errors: errors.array(),
      })
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) next(err);

        const obj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashedPassword,
        }

        await db.createUser(obj);
        console.log('User created successfully', obj);
      });

      res.redirect('/');
    }
  }
];

const loginGet = async (req, res) => {
  res.render('login_form', {
    title: 'Login',
    errors: req.session.messages ? [{ msg: req.session.messages.at(-1) }] : [], 
  });
};

const loginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true,
});

const logoutGet = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect('/');
  });
};

const memberPageGet = (req, res) => {
  res.render('member_form', {
    title: 'Become a member',
  });
};

const memberPagePost = [
  body('member_password')
    .trim()
    .custom((value) => {
      return value === process.env.MEMBER;
    })
    .withMessage('Wrong member password'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('member_form', {
        title: 'Become a member',
        errors: errors.array(),
      });
    } else {
      await db.updateUserMembership(req.user.id);

      res.redirect('/');
    }
  },
];

const newMessageGet = async (req, res) => {
  res.render('message_form', {
    title: 'New message'
  });
};
  
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
      await db.createMessage(req.user, message);

      res.redirect('/');
    }
  }
];

const adminGet = (req, res) => {
  if (req.isAuthenticated()) {
    res.render('admin_form', {
      title: 'Please enter the admin password',
    });
  } else {
    res.redirect('/');
  }
};

const adminPost = [
  body('admin_password')
    .trim()
    .custom((value) => {
      return value === process.env.ADMIN;
    })
    .withMessage('Wrong admin password'),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('admin_form', {
        title: 'Admin',
        errors: errors.array(),
      });
    } else {
      await db.updateAdminStatus(req.user.id);

      res.redirect('/');
    }
  },
];

const deleteMessageGet = async (req, res) => {
  if (!req.user.admin) return;

  await db.deleteMessage(req.params.id);

  res.redirect('/');
}

module.exports = {
  index,
  signUpGet,
  signUpPost,
  loginGet,
  loginPost,
  logoutGet,
  memberPageGet,
  memberPagePost,
  newMessageGet,
  newMessagePost,
  adminGet,
  adminPost,
  deleteMessageGet,
}
