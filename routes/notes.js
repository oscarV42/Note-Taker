const notes = require('express').Router();
const { readFromFile, readAndAppend, readAndDelete } =  require('../helpers/fsUtils');
const  uuid = require('../helpers/uuid');