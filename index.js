const express = require("express");
const mysql = require('mysql')

const app = express();
const port = process.env.PORT || 8000;

//Database
const connection = mysql.createConnection({
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/page", (req, res) => {
  res.send("Page!");
});

app.get("/echo", (req, res) => {
  res.send(req.query);
});

app.get("/api", (req, res) => {
  connection.query('SELECT * FROM testtable', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching');
      return;
    }
    res.json(results);
  });
});

app.get("/api1", (req, res) => {
  connection.query('CREATE TABLE testtable (userid int, lastname varchar(100))', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching');
      return;
    }
    res.json(results);
  });
});

app.get("/api2", (req, res) => {
  connection.query('CREATE DATABASE testdb', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching');
      return;
    }
    res.json(results);
  });
});

app.get("/api0", (req, res) => {
  connection.query('INSERT INTO testtable (userid, lastname) VALUES (\'1\', \'test\');', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
