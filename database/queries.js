const pool = require('./pool');

async function getAllMessages() {
  const { rows } = pool.query('SELECT messages.title, messages.content, messages.timestamp, users.firstname, users.lastname, users.email, users.membership, users.admin FROM messages INNER JOIN users ON messages.user_id = users.id');

  return rows;
};

module.exports = {
  getAllMessages,
}
