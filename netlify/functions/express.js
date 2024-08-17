// netlify/functions/express.js
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const serverless = require('serverless-http');
const app = express();
const path = require('path');

// Path to the CSV file
const csvFilePath = path.join(__dirname, 'output.csv');

// Load CSV data into memory
let placesData = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => placesData.push(row))
  .on('end', () => {
    console.log('CSV data loaded successfully.');
  });

// Serve static files
app.use(express.static('public'));

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = placesData.filter(place =>
    place['Full Address Detail'].toLowerCase().includes(query)
  );
  res.json(results);
});

// Export the handler for Netlify Funyctions
module.exports.handler = serverless(app);
