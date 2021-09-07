// declaring constants
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');
const { parse } = require('path');
const { URLSearchParams } = require('url');
const { url } = require('inspector');
const { request } = require('http');
const app = express();
const PORT = 3001;

//Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

//Get route for /notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const WriteToFile = (destination, content) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => 
        err ? console.log(err) : console.info(`\nData written to ${destination}`)
    );
}

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err){
            console.error(err);
        }else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            WriteToFile(file, parsedData);
        }
    })
}

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} id The content you want to delete from the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndDelete = (id, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err){
            console.error(err);
        }else {
            const parsedData = JSON.parse(data);
            const filteredData = (parsedData, id) => {
                for(var i = 0; i < parsedData.length; i++){
                    if(parsedData[i].id === id){
                        parsedData.splice(i, 1);
                        i = parsedData.length;
                    }
                }
                return parsedData;
            }
            WriteToFile(file, filteredData(parsedData, id));
            console.log(filteredData(parsedData, id))
        }
    })
}
  

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET route that returns any specific id
app.get('/api/notes/:id', (req, res) => {
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
app.post(`/api/notes`, (req, res) => {
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
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);
    const id = req.url.substring(
        req.url.lastIndexOf(""), 
        req.url.lastIndexOf("?") + 1
    )

    if(req.body) {
        readAndDelete(id , './db/db.json');
        res.json(`Note Deleted! ☝️`);
    }else {
        res.error('Error in deleting note');
    }
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);