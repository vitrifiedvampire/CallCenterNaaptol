const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
const nodemailer = require('nodemailer');



// Rest of your server code...


app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// Add other middleware as required
// Create a transporter using your SMTP server details
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'arbabwillrock2@gmail.com',
    pass: 'uskhjlqesgpdtljj'
  }
});
// Serve static files from the current directory
app.use(express.static(__dirname));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3001;

// Create a connection pool to handle database connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'arbabisnoman',
  database: 'naaptoldb',
});

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Set up a route to handle the request and send the "index.html" file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/first.html');
});

// Set up a route to retrieve the data from the database and send it as JSON
app.get('/data', (req, res) => {
  // Retrieve the data from the monthly_fixed_cost table using the connection pool
  pool.query('SELECT * FROM monthly_fixed_cost', (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return;
    }

    res.json(results);
  });
});

// Set up a route to retrieve the row data from the database and send it as JSON
app.get('/rowdata/:id', (req, res) => {
  const id = req.params.id;

  // Retrieve the row data from the monthly_fixed_cost table using the connection pool and the provided ID
  pool.query('SELECT * FROM monthly_fixed_cost WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error retrieving row data:', err);
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Row not found' });
    } else {
      res.json(results[0]);
    }
  });
});
  

 // Update the record in the database
// Set up a route to update the record in the database
app.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  

  // Update the record in the database
  const query = `
    UPDATE naaptoldb.monthly_fixed_cost
    SET
      call_center_name = ?,
      ctc_slab = ?,
      management_fees = ?,
      seat_cost_infra = ?,
      ot_rate_per_hr = ?,
      retention_cost = ?
    WHERE id = ?
  `;
  const values = [
    updatedData.call_center_name,
    updatedData.ctc_slab,
    updatedData.management_fees,
    updatedData.seat_cost_infra,
    updatedData.ot_rate_per_hr,
    updatedData.retention_cost,
    id // Add the ID value here
  ];
  
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating the record:', err);
      res.status(500).json({ error: 'Error updating the record' });
    } else {
      // Retrieve the updated row data from the database
      pool.query('SELECT * FROM monthly_fixed_cost WHERE id = ?', [id], (err, updatedRow) => {
        if (err) {
          console.error('Error retrieving updated row data:', err);
          res.status(500).json({ error: 'Error retrieving updated row data' });
        } else {
          if (updatedRow.length === 0) {
            res.status(404).json({ error: 'Row not found' });
          } else {
            res.json(updatedRow[0]); // Send the updated row as JSON in the response
          }
        }
      });
    }
  });
});
// Add an API endpoint to send email notification

// API endpoint to handle email notification
app.post('/sendEmail', function(req, res) {
  // Compose the email content
  const emailData = req.body;

  // Compose the email
  const mailOptions = {
    from: 'arbabwillrock2@gmail.com',
    to: 'arbabbadarkhan02@gmail.com',
    subject: emailData.subject,
    text: emailData.body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email notification:', error);
      res.status(500).json({ error: 'Error sending email notification' });
    } else {
      console.log('Email notification sent:', info.response);
      res.json({ message: 'Email notification sent' });
    }
  });
});






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

