const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('./db'); // Import the database connection
const cors = require('cors');

const app = express();


app.use(express.json());

app.use(cors({
  origin: '*', // For development; specify your frontend's origin in production
}));


// Create a new TODO list
app.post('/todo', (req, res) => {
  const { todos = [], allowEditing = true, password = null } = req.body;

  const id = uuidv4();
  const todosString = JSON.stringify(todos);
  const allowEditingFlag = allowEditing ? 1 : 0;

  const query = `INSERT INTO todos (id, todos, allowEditing, password) VALUES (?, ?, ?, ?)`;

  db.run(query, [id, todosString, allowEditingFlag, password], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create TODO list' });
    }
    res.status(201).json({ id, message: 'TODO list created' });
  });
});

// Get TODO list by ID
app.get('/todo/:id', (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM todos WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve TODO list' });
    }
    if (!row) {
      return res.status(404).json({ error: 'TODO list not found' });
    }

    res.status(200).json({
      id: row.id,
      todos: JSON.parse(row.todos),
      allowEditing: row.allowEditing === 1,
      password: row.password,
    });
  });
});

// Update TODO list
app.put('/todo/:id', (req, res) => {
  const { id } = req.params;
  const { todos, allowEditing, password } = req.body;

  const query = `SELECT * FROM todos WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve TODO list' });
    }
    if (!row) {
      return res.status(404).json({ error: 'TODO list not found' });
    }

    if (row.allowEditing === 0 && !allowEditing) {
      return res.status(403).json({ error: 'Editing not allowed for this list' });
    }

    const todosString = JSON.stringify(todos);
    const allowEditingFlag = allowEditing ? 1 : 0;

    const updateQuery = `UPDATE todos SET todos = ?, allowEditing = ?, password = ? WHERE id = ?`;

    db.run(updateQuery, [todosString, allowEditingFlag, password, id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update TODO list' });
      }
      res.status(200).json({ message: 'TODO list updated' });
    });
  });
});
// Delete TODO list
app.delete('/todo/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM todos WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete TODO list' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'TODO list not found' });
    }
    res.status(200).json({ message: 'TODO list deleted' });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
