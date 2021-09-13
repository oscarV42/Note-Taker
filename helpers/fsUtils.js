const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
 const writeToFile = (destination, content) =>
 fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
   err ? console.error(err) : console.info(`\nData written to ${destination}`)
 );

 /**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
  
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
            console.log(`note ${id} deleted.`);
        }
    })
}
  