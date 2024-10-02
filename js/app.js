// Express API to set up web server
const express = require("express");
const path = require('path');
const app = express();
const port = 3000;

// CFB API Setup
const cfb = require("cfb.js");
const defaultClient = cfb.ApiClient.instance;
const ApiKeyAuth = defaultClient.authentications["ApiKeyAuth"];
ApiKeyAuth.apiKey =
  "Bearer K6yJb6pJ3pglZYpyhwuFV2vO3hUyjwcHBF2UU1mcguq24PYVamIO2oZepz/Bittr";

// IMPORTANT NOTE if you want to extend this app
// TeamsApi is a subset of the much large cfb api
// Check out this link:
// https://github.com/CFBD/cfb.js/tree/master
// Scroll down to the readme and look at the table under "Documentation for API Endpoints"
// Different parts of the api are organized into different classes (betting, teams, etc.)
// To access those different parts, declare a new api variable (with different name) to access functions in that class
// For example, the getCalendar function is in the "GamesApi" class
// Declare a new api variable like so
// const games_api = new cfb.GamesApi();
// then do games_api.<some function>(params) to use those functions
//

const api = new cfb.TeamsApi();

// Opens port for connections
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Serves a route to the browser
app.get("/", (req, res) => {
  // Assumes that mainpage.html is one level above the directory of this code
  res.sendFile(path.join(__dirname, '..', 'mainpage.html'));
});

// Serves a route to the browser, with a dynamic url parameter
app.get("/name/:name", (req, res) => {
  const name = req.params.name;
  res.send(`Your name is ${name}`);
});

// Serves a route to browser with TWO url parameters
// https://github.com/CFBD/cfb.js/blob/master/docs/TeamsApi.md#getTeamMatchup
app.get("/matchup/:team1/:team2", (req, res) => {
  // Get url parameters
  const team1 = req.params.team1;
  const team2 = req.params.team2;

  // Sets some additional options for the query
  const opts = {
    minYear: 1900,
    maxYear: 2024,
  };

  // Performs the api function and sends results to browser
  api.getTeamMatchup(team1, team2, opts).then(function (data) {
    res.send(
      `Overall record is ${data.team1Wins} - ${data.team2Wins} - ${data.ties}`,
    );
  });
});

// Route to get all the teams in a conference
// API Doc: https://github.com/CFBD/cfb.js/blob/master/docs/TeamsApi.md#getTeams

app.get("/conferences/:conference", (req, res) => {
  const conf = req.params.conference;
  const arr = [];
  var opts = {
    'conference': ""
  };

  api.getTeams(opts).then(function (data) {
    for (let i = 0; i < data.length; i ++) {
      arr.push(data[i].school);
    }
    res.send(arr);
  });
});