// dependencies
const fs = require('fs');
const express = require('express');
const path = require('path');

// setting up the express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware for urlencoded form data and parsing JSON 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

// GET route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

// return the saved notes as JSON
app.get('/api/notes', (req, res) => {
    console.log("Acquiring the notes");
        fs.readFile("db/db.json", "utf8", (err, data) => {
            if (err) throw err;
            let notes = JSON.parse(data);
            res.json(notes);
        });
    });

// get the new note to save on the req body and placing it to the db.json file and getting back the new note
app.post('/api/notes', (req, res) => {
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) throw err;

        let notes = JSON.parse(data);

        let newNote = req.body;
        let uniqueId = (notes.length).toString();
        newNote.id = uniqueId;
        console.log(newNote);
        notes.push(newNote);

        fs.writeFileSync("db/db.json", JSON.stringify(notes), "utf8", (err, data) => {
            if (err) throw err;
            console.log("The note has been added!");
        });

        res.json(notes);
    });
    });

// Acquiring a query parameter using the id of the note when deleting. The function reads the data from the db.json file, then removes the note with the particular id, and then displays the remaining notes in the file
app.delete("/api/notes/:id", function (req, res) {
    fs.readFile("db/db.json", "utf8", (err, data) => {
            if (err) throw err;

            let notes = JSON.parse(data);
            let notesId = req.params.id;
            let notenewId = 0;

            notes = notes.filter(theNewNote => {
                return theNewNote.id != notesId;
            });

            for (theNewNote of notes) {
                theNewNote.id = notenewId.toString();
                notenewId++;
            }

            fs.writeFileSync("db/db.json", JSON.stringify(notes), "utf8", (err, data) => {
                if (err) throw err;
                console.log("Done!");
            });

            res.json(notes);
        });
    });

// initiates server to start listening
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`);
  });