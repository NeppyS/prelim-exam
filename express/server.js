const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prelim", // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// CRUD operations for todos

// Get all todos
app.get("/api/todos", (req, res) => {
  const sql = "SELECT * FROM tbl_todo";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching todos:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Create a new todo
app.post("/api/todos", (req, res) => {
  const { task, completed } = req.body;
  const sql = "INSERT INTO tbl_todo (task, completed) VALUES (?, ?)";

  db.query(sql, [task, completed], (err, result) => {
    if (err) {
      console.error("Error inserting todo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({ id: result.insertId, task, completed });
    }
  });
});

// Update a todo
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const sql = "UPDATE tbl_todo SET task = ?, completed = ? WHERE id = ?";

  db.query(sql, [task, completed, id], (err, result) => {
    if (err) {
      console.error("Error updating todo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ id, task, completed });
    }
  });
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tbl_todo WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Todo deleted successfully" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
