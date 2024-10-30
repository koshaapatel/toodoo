const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database
const db = new sqlite3.Database('./todo.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        todos TEXT NOT NULL,
        allowEditing INTEGER NOT NULL,
        password TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      }
    });
  }
});

module.exports = db;
