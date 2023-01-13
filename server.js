const fs = require('fs');
const express = require('express');
const path = require('path');
const { notes }= require('./db/db.json')
const api = require('./routes/index.js');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });

app.get('/api/notes', (req, res) => res.json(notes));

app.post('/', (req, res)=> {
    req.body.id = uuidv4();
    const newNote = req.body;
    notes.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes }, null, 2)
    );
    res.json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const noteIndex = notes.findIndex(n => n.id == id);
    notes.splice(noteIndex, 1);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes }, null, 2)
    );
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });