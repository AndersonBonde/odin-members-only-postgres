require('dotenv').config();

const { Client } = require('pg');

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    membership BOOLEAN NOT NULL DEFAULT false,
    admin BOOLEAN NOT NULL DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    timestamp DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  INSERT INTO users 
    (firstname, lastname, email, password, membership, admin)
  VALUES
    (
      'Anderson',
      'Bonde',
      'andersonbonde@gmail.com', 
      '123',
      true,
      true
    );

  INSERT INTO messages
    (title, content, user_id)
  VALUES
    (
      'Placeholder title',
      'Placeholder message content',
      (SELECT id FROM users WHERE firstname = 'Anderson')
    );
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
