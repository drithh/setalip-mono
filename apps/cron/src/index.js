// index.js
import fetch from 'node-fetch';
import fs from 'fs';
import cron from 'node-cron';

// URL of the API endpoint
const apiUrl = 'http://localhost:3000/api/trpc/cron.cron?batch=1';

// Data to be sent in the POST request
const postData = {
  0: { json: { secret: process.env.CRON_SECRET } },
};

// Options for the fetch request
const fetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(postData),
};

// Function to fetch data from the API and save the result to a file
async function fetchDataAndSave() {
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Save the result to cron.log
    fs.appendFile(
      'cron.log',
      new Date().toISOString() + ' ' + JSON.stringify(data) + '\n',
      (err) => {
        if (err) {
          console.error('Error writing to cron.log:', err);
        } else {
          console.log('Data successfully written to cron.log');
        }
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Schedule the task to run every minute
cron.schedule('0 */3 * * *', () => {
  console.log(`Running cron job at ${new Date().toISOString()}`);
  fetchDataAndSave();
});
