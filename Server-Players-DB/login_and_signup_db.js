//connect database
require("dotenv").config();
const { emailValidation, passwordValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
  port: process.env.DB_PORT,
  database: `${process.env.DB_DATABASE}`,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

const createUser = async (request, response) => {
  try {
    const { username, email, password, currency } = request.body;
    let errors = {};

    if (!emailValidation(email)) {
      errors.email = "Email is not valid";
    }
    if (!passwordValidation(password)) {
      errors.password = "Password is not valid";
    }

    const isEmailInUse = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (isEmailInUse.rows.length > 0) {
      errors.email = "Email is already in use";
    }

    if (Object.keys(errors).length > 0) {
      return response.status(400).json(errors);
    }

    const salt = await bcrypt.genSalt(10); //salt encryption
    const hashedPassword = await bcrypt.hash(password, salt); //hash encryption

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, currency) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, currency]
    ); //what this does: hey so you got the username, email, and password, i want you to
    // run a query on the database so that it inserts this information using the sql in the quotes
    response.json({ success: true, data: newUser.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    let errors = {};

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      response.status(400).json({ errors: "Email is not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      errors.password = "Password is incorrect";
    }
    if (Object.keys(errors).length > 0) {
      return response.status(401).json(errors);
    }
    response.json({ success: true, data: user.rows[0] });
  } catch (error) {
    console.error(error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [id];
  try {
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      res.status(404).json({
        error: "User not found",
      });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { currency } = req.body;
    const changeCurrency = await pool.query(
      "UPDATE users SET currency = $1 WHERE id = $2", //update in users table set currency to $1
      [currency, id] //specify table
    );

    res.json("currency was updated!");
  } catch (err) {
    console.error(err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);

    res.json("User was deleted!");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  updateCurrency,
  deleteUser,
};
