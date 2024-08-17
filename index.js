const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;

// Path to the CSV file
const csvFilePath = 'output.csv';

// Load CSV data into memory
let placesData = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => placesData.push(row))
  .on('end', () => {
    console.log('CSV data loaded successfully.');
  });

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = placesData.filter(place =>
    place['Full Address Detail'].toLowerCase().includes(query)
  );
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
