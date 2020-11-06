import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";
const { Client } = require("pg");
const bodyParser = require("body-parser"); // makes reading requests easier
import "ignore-styles"; // to ignore CSS files when importing components

// To use streams
import fs from "fs";

// React Components
import App from "./App/App";

// Stream ??
//import { Stream } from "stream";

// Get the port
const PORT = process.env.PORT || 3000;

// Create express server
const server = express();

// These two lines work together to make reading requests information easy
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.json());

// Set up server properties
server.use("/dist", express.static("dist/"));

// Tell express that when it sees /public make it translate go to the appropriate folder
const pathToPublic = __dirname.substring(0, __dirname.length - 4) + "/public";
server.use("/public", express.static(pathToPublic));

// MIGHT NOT BE NECCESSARY!!
// Send neccessary files server->client
server.get("/public/images/:id", (req, res) => {
  // log the activity to the server console
  console.log('server.get("/public/images/:id") [html request]');

  //res.sendFile(__dirname + "/public/" + req.params.id);
  res.sendFile("/public/images/" + req.params.id);
});

// MIGHT NOT BE NECCESSARY!!
// Send neccessary files server->client
server.get("/public/fonts/:id", (req, res) => {
  // log the activity to the server console
  console.log('server.get("/public/fonts/:id") [html request]');

  //res.sendFile(__dirname + "/public/" + req.params.id);
  res.sendFile("/public/fonts/" + req.params.id);
});

// Getting "/"
server.get("/", (req, res) => {
  console.log("get request to /");

  const HTML = ReactDOMServer.renderToString(
    <>
      <App />
    </>
  );

  // <body style="margin:0px;font-family:Fondamento" id="body"></body>

  res.send(`
  <html>
    <head>
      <title>Sample Application</title>
      <meta name="charset" content="utf-8" />
      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1.1">
      <meta name="author" content="Yuri Dubler" />
      <meta name="description" content="Sample Application" />
      <link href="https://fonts.googleapis.com/css2?family=Fondamento&display=swap" rel="stylesheet">
    </head>
    <body style="margin:0px;" id="body">
      <div id="mountnode">${HTML}</div>
      <script src="../dist/main.js"></script>
    </body>
  </html>
  `);
});

// Getting "/get/sample/all"
server.get("/get/sample/all", async (req, res) => {
  console.log("get request to /get/sample/all");

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });

    await client.connect();

    client.query("SELECT * FROM sample2;", (err, resp) => {
      if (err) throw err;
      for (let row of resp.rows) {
        console.log(JSON.stringify(row));
      }
      res.json({
        text: "Success! Connected to database & returned values.",
        success: true,
        data: resp.rows,
      });
      client.end();
    });
  } catch {
    // If we fail to connect to the database
    res.json({
      text: "Failure! Could not connect to database.",
      success: false,
      data: null,
    });
  }
});

// Getting "/post/sample"
server.post("/post/sample", async (req, res) => {
  console.log("get request to /post/sample");

  // Get the data from the HTTP Post Request
  const { name, date } = req.body;

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });
    await client.connect();

    const query = `INSERT INTO sample2 (name, date) values ('${name}', '${date}');`;
    client.query(query, (err, resp) => {
      if (err) throw err;
      for (let row of resp.rows) {
        console.log(JSON.stringify(row));
      }
      res.json({
        text: "Success! Connected to database & inserted values.",
        success: true,
      });
      client.end();
    });
  } catch {
    res.json({
      text: "Failure! Could not connect to database.",
      success: false,
    });
  }
});

// Post request to /login
server.post("/user/login", async (req, res) => {
  // Get username and password being passed in by the user
  const { username, password } = req.body;

  console.log(
    "Request Body:\n\tusername: " + username + "\n\tpassword:" + password
  );

  // Try creating the client and connecting to the database...
  try {
    // Create the new client
    const client = new Client({
      connectionString:
        process.env.DATABASE_URL ||
        "postgres://grqmgaksoppydv:fb8ad3a0d5ee4253fd83d6bfe915d3671f8ffcc233a69d036f81224daf4c75ea@ec2-52-202-106-147.compute-1.amazonaws.com:5432/dcfjir8k9sqakt",
      ssl: true,
    });

    // Attempt to connect the client to the database...
    await client.connect();

    // Get all of the user information
    const db_query = `SELECT userlogin.password, userinfo.userid, userinfo.first_name, userinfo.last_name, userinfo.email, userinfo.coin_amount, userlogin.username, userlogin.is_admin, userlogin.is_superadmin from userlogin, userinfo where userinfo.userid=userlogin.userid AND userlogin.username='${username}';`;

    // Query the database
    client.query(db_query, async (err, dbres) => {
      console.log("Database Queried: " + db_query);
      if (err) {
        // ERROR QUERYING
        console.log("Error during query process. Throwing error.");
        client.end();
        res.json({
          text: "Failed to login. Error querying database.",
          success: false,
          logged_in: false,
          userid: -1,
          username: "",
          first_name: "",
          last_name: "",
          coin_amount: -1,
          is_admin: false,
          is_superadmin: false,
        });
        throw err;
      } else if (dbres.rows.length === 1) {
        // DATABASE RETURNS A SINGLE ROW (USERNAME EXISTS)
        console.log("Database returned the following data:\n");

        // Log what the databse returned
        for (let [key, value] of Object.entries(dbres.rows[0])) {
          console.log(`\t${key}: ${value}`);
        }

        // Get the hashed password stored in the database...
        const hashedPassword = dbres.rows[0].password;

        // Use bcrypt.compare to compare the request-password with hashed-password (from the database)
        if (await bcrypt.compare(password, hashedPassword)) {
          // PASSWORDS MATCH
          console.log("Passwords match!");

          // Get all of the remaining information from the return query
          const {
            userid,
            first_name,
            last_name,
            email,
            coin_amount,
            username,
            is_admin,
            is_superadmin,
          } = dbres.rows[0];

          // Set session values
          console.log("Setting session values for " + username + ".");
          req.session.userid = userid;
          req.session.first_name = first_name;
          req.session.last_name = last_name;
          req.session.email = email;
          req.session.coin_amount = coin_amount;
          req.session.logged_in = true;
          req.session.username = username;
          req.session.is_admin = is_admin;
          req.session.is_superadmin = is_superadmin;
          //req.session.save(); // might be unneccesary

          // Return JSON information in the response.
          res.json({
            text: "Credentials match! " + username + " is now logged in.",
            logged_in: true,
            success: true,
            userid: userid,
            first_name: first_name,
            last_name: last_name,
            email: email,
            coin_amount: coin_amount,
            username: username,
            is_admin: is_admin,
            is_superadmin: is_superadmin,
          });
        } else {
          // PASSWORDS DON'T MATCH

          // Return JSON information in the response.
          res.json({
            text: "Failed to log in. Credentials didn't match.",
            logged_in: false,
            success: false,
            userid: -1,
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            coin_amount: -1,
            is_admin: false,
            is_superadmin: false,
          });
        }
      } else {
        // DATABASE DID NOT RETURN A SINGLE ROW --> USERNAME DOESN'T EXIST

        // Return JSON information in the response.
        res.json({
          text: "Failed to log in. Username does not exist.",
          success: false,
          logged_in: false,
          userid: -1,
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          coin_amount: -1,
          is_admin: false,
          is_superadmin: false,
        });
      }
      // End the client.
      client.end();
    });
  } catch {
    // Error was caught

    // Return JSON information in the response.
    res.json({
      text: "Username does not exist.",
      logged_in: false,
      success: false,
      userid: -1,
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      coin_amount: -1,
      is_admin: false,
      is_superadmin: false,
    });
  }
});

server.listen(PORT, console.log("Server ON (Port " + PORT + ")"));
