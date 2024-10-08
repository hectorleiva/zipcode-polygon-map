const { Pool, Client } = require("pg");

// const client = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "zipcode_polygons",
//   password: "postgres",
//   port: 5433,
// });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "zipcode_polygons",
  password: "postgres",
  port: 5433,
});

module.exports = { pool };
