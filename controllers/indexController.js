const db = require('../database/queries');

const index = async (req, res) => {
  const messages = await db.getAllMessages();

  res.render('index', {
    title: 'Message Board',
    messages: messages,
  })
};

module.exports = {
  index,
}
