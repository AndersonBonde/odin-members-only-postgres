const pool = require('./pool');

async function getAllMessages() {
  const { rows } = await pool.query('SELECT messages.title, messages.content, messages.timestamp, users.firstname, users.lastname, users.email, users.membership, users.admin FROM messages INNER JOIN users ON messages.user_id = users.id');

  return rows;
};

async function createMessage(obj) {
  const { title, content } = obj;

  // TODO Update to include user_id, user_id is required to not be null;

  await pool.query('INSERT INTO messages (title, content) VALUES ($1, $2)', [title, content]);
}

module.exports = {
  getAllMessages,
}
