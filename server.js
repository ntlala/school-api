const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

// Connect to SQLite (creates file if not exists)
const db = new Database('school.db');

// Create students table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    contact TEXT
  )
`).run();

app.use(express.json());

// Serve frontend static files from 'public' folder
app.use(express.static('public'));

// GET all students with search/filter + sort by name ASC
app.get('/students', (req, res) => {
  const { name, grade } = req.query;

  let query = 'SELECT * FROM students WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (grade) {
    query += ' AND grade = ?';
    params.push(grade);
  }

  // Sort by name in ascending order
  query += ' ORDER BY name ASC';

  const students = db.prepare(query).all(...params);
  res.json(students);
});

// POST new student
app.post('/students', (req, res) => {
  const { name, grade, contact } = req.body;
  if (!name || !grade) {
    return res.status(400).json({ error: 'Name and grade are required' });
  }
  const stmt = db.prepare('INSERT INTO students (name, grade, contact) VALUES (?, ?, ?)');
  const result = stmt.run(name, grade, contact || '');
  const newStudent = { id: result.lastInsertRowid, name, grade, contact: contact || '' };
  res.status(201).json(newStudent);
});

// PATCH update student
app.patch('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, grade, contact } = req.body;

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const updatedName = name || student.name;
  const updatedGrade = grade || student.grade;
  const updatedContact = contact || student.contact;

  db.prepare('UPDATE students SET name = ?, grade = ?, contact = ? WHERE id = ?')
    .run(updatedName, updatedGrade, updatedContact, studentId);

  res.json({ id: studentId, name: updatedName, grade: updatedGrade, contact: updatedContact });
});

// DELETE student
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  db.prepare('DELETE FROM students WHERE id = ?').run(studentId);
  res.json({ message: 'Student removed', student });
});

app.listen(PORT, () => {
  console.log(`✅ School API with SQLite running at http://localhost:${PORT}`);
});
