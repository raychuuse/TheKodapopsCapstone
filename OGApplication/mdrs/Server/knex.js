module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_SCHEMA,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};
