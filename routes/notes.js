const notes = require('express').Router();
const { readFromFile, readAndAppend, readAndDelete } =  require('../helpers/fsUtils');
const  uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET route that returns any specific id
notes.get('/:id', (req, res) => {
    // Coerce the specific search term to lowercase
    const requestedId = req.params.id;
    const dataHelper = readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    // Iterate through the terms name to check if it matches `req.params.term`
    for (let i = 0; i < dataHelper.length; i++) {
      if (requestedId === dataHelper[i].id) {
        return res.json(dataHelper[i]);
      }else{
        // Return a message if the term doesn't exist in our DB
        return res.json('No match found');
      }
    }
  
});

// POST Route for a new UX/UI note
notes.post(`/`, (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if(req.body) {
        const newTip = {
            title, 
            text,
            id: uuid(),
        }

        readAndAppend(newTip, './db/db.json');
        res.json('Noted! ☝️');
    } else {
        res.error('Error in adding note');
    }
});

// DELETE route for a removed UI note
notes.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);
    const id = req.url.substring(
        req.url.lastIndexOf("/") + 1, 
        req.url.lastIndexOf("")
    )

    if(req.body) {
        readAndDelete(id , './db/db.json');
        res.json(`Note Deleted! ☝️`);
    }else {
        res.error('Error in deleting note');
    }
});

module.exports = notes;