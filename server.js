// declaring constants
const express = requuire('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();

//Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET route for homepage
app.get('*', (req, res) => {
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