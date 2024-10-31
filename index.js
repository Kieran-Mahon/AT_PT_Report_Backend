const express = require("express");
const cors = require('cors');
const mysql = require('mysql')

const app = express();
const port = process.env.PORT || 8000;
app.use(
  cors({
    origin: '*'
  })
);

//Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Start the connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function connectToDB() {
  //Connect to the database
  connection.connect((err) => {
    //Make sure no errors
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return false;
    }
    console.log('Connected to MySQL as ID ' + connection.threadId);
    return true;
  });
}

//Main API request - Selects speed data from the database
app.get("/road-data", (req, res) => {
  //Make sure there is a connection to the database
  if (connectToDB() == false) {
    res.status(500).send('Error connecting to database');
    return;
  }

  //Get the variables from the request
  const route = req.query.route;
  const day = req.query.day;
  const hour = req.query.hour;

  //Write a message to log to signal that someone requested
  console.log("Requested: " + route + ", on " + day + ", at " + hour);

  //Query for the database to select the correct data
  let query = 'SELECT at_data.speed_data.dataCount, at_data.road_data.latA, at_data.road_data.lonA, at_data.road_data.latB, ';
  query += 'at_data.road_data.lonB, at_data.road_data.roadName, at_data.speed_data.sumSpeed, at_data.road_data.maxSpeed ';
  query += 'FROM at_data.road_data inner join at_data.speed_data ON at_data.road_data.roadID = at_data.speed_data.roadID ';
  query += 'WHERE at_data.road_data.roadID IN (SELECT roadID FROM at_data.route_data WHERE routeID = ?) AND day = ? AND hour = ?;';

  //Execute the query
  connection.query(query, [route, day, hour], (err, results) => {
    //Check for any errors
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching');
      return;
    }

    //Return the selected data
    res.json(results);
  });
});
