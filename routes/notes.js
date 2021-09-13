const notes = require('express').Router();
const { readFromFile, readAndAppend, readAndDelete } =  require('../helpers/fsUtils');
const  uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});