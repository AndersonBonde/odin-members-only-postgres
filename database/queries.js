const pool = require('./pool');

async function getAllMessages() {
  const { rows } = await pool.query('SELECT messages.title, messages.content, messages.timestamp, users.firstname, users.lastname, users.email, users.membership, users.admin FROM messages INNER JOIN users ON messages.user_id = users.id');

  return rows;
};

async function createMessage(user, messageObj) {
  const { title, content } = messageObj;
  const { id } = user;

  // TODO Update to include user_id, user_id is required to not be null;

  await pool.query('INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)', [title, content, id]);
}

async function createUser(obj) {
  const { firstname, lastname, email, password } = obj;

  await pool.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, password]);
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  return rows[0];
}

async function updateUserMembership(id) {
  await pool.query('UPDATE users SET membership = true WHERE id = $1', [id]);
}

module.exports = {
  getAllMessages,
  createMessage,
  createUser,
  findUserByEmail,
  updateUserMembership,
}
