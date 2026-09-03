const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../floor6matrix.txt');
const outputFile = path.join(__dirname, '../frontend/src/assets/floor6matrix.json');

const text = fs.readFileSync(inputFile, 'utf-8');

// Extract the matrix array part from the text using regex
const matrixMatch = text.match(/\[\s*\[(.*?)\]\s*\]/s);

if (!matrixMatch) {
  console.error("Could not find matrix array in the file");
  process.exit(1);
}

// Extract rows of the matrix
const matrixString = matrixMatch[0];
const rowsStr = matrixString.match(/\[(.*?)\]/g);

const matrix = [];
rowsStr.forEach((rowStr) => {
  // skip the outer bracket match if it happens
  if (rowStr.trim() === '[]') return;
  
  // Clean up the row and split by comma
  const elements = rowStr.replace(/\[|\]/g, '').split(',').map(s => s.trim()).filter(s => s.length > 0);
  if (elements.length > 0) {
    matrix.push(elements);
  }
});

const rows = matrix.length;
const columns = matrix.length > 0 ? matrix[0].length : 0;

const outputJson = {
  rows,
  columns,
  matrix
};

fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2));
console.log(`Successfully wrote to ${outputFile} with ${rows} rows and ${columns} columns.`);
