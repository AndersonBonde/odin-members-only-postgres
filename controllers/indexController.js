const db = require('../database/queries');

const index = async (req, res) => {
  const messages = await db.getAllMessages();

  res.render('index', {
    title: 'Homepage',
    messages: messages,
  })
};

module.exports = {
  index,
}
