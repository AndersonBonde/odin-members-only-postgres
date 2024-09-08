require('dotenv').config();

const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./database/pool');
const indexRouter = require('./routes/indexRouter');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Setup session & passport;

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(passport.session());

const strategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

// --- Routes

app.use('/', indexRouter);

app.listen(3000, () => console.log('App listening on port 3000!'));
