const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: id } = require('uuid'); // Changed variable name to 'id'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Notes page route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API routes

// Get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Save note
app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = id(); // Changed variable name to 'id' when generating a unique ID for the new note
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.json(newNote);
    });
  });
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        let notes = JSON.parse(data);
        const updatedNotes = notes.filter(note => note.id !== noteId);
        fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
