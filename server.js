const fs = require('fs');
const express = require('express');
const path = require('path');
const dbdata = require('./db/db.json')
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/api/terms', (req, res) => res.json(dbdata));

app.listen(PORT, () => {
    console.log(`Note taker will be at http://localhost:${PORT}`);
  });