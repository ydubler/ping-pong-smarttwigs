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

// Getting "/get/sample"
server.get("/get/players", async (req, res) => {
  console.log("get request to /get/players");

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });

    await client.connect();

    client.query("SELECT * FROM players;", (err, resp) => {
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

// Getting "/post/newplayer"
server.post("/post/newplayer", async (req, res) => {
  console.log("get request to /post/newplayer");

  // Get the data from the HTTP Post Request
  const { name } = req.body;

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });
    await client.connect();

    const query = `INSERT INTO players (name, wins, points) values ('${name}', 0, 0);`;
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

// Getting "/post/newplayer"
server.post("/post/games", async (req, res) => {
  console.log("get request to /post/games");

  // Get the data from the HTTP Post Request
  const { id } = req.body;

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });
    await client.connect();

    const query = `select * from games where p1id=${id} or p2id=${id};`;
    client.query(query, (err, resp) => {
      if (err) throw err;
      for (let row of resp.rows) {
        console.log(JSON.stringify(row));
      }
      res.json({
        text: "Success! Connected to database & inserted values.",
        success: true,
        data: resp.rows,
      });
      client.end();
    });
  } catch {
    res.json({
      text: "Failure! Could not connect to database.",
      success: false,
      data: null,
    });
  }
});

// Getting "/post/addgame"
server.post("/post/addgame", async (req, res) => {
  console.log("get request to /post/addgame");

  // Get the data from the HTTP Post Request
  const { p1id, p1score, p2id, p2score } = req.body;

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });
    await client.connect();

    const query = `INSERT INTO games (p1id, p1score, p2id, p2score, serverid) values (${p1id}, ${p1score}, ${p2id}, ${p2score}, ${p1id});`;
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

// Getting "/post/addgame"
server.post("/post/updategame", async (req, res) => {
  console.log("get request to /post/updategame");

  // Get the data from the HTTP Post Request
  const { gameID, p1score, p2score } = req.body;

  try {
    const client = new Client({
      user: "yuridmitridubler",
      host: "localhost",
      database: "yuridmitridubler",
      password: "",
      port: 5432,
    });
    await client.connect();

    const query = `update games set p1score=${p1score}, p2score=${p2score} where id=${gameID};`;
    client.query(query, (err, resp) => {
      if (err) throw err;
      for (let row of resp.rows) {
        console.log(JSON.stringify(row));
      }
      res.json({
        text: "Success! Connected to database & updated values.",
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

server.listen(PORT, console.log("Server ON (Port " + PORT + ")"));
