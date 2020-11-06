import React, { useState, useEffect, Fragment } from "react";
import regeneratorRuntime from "regenerator-runtime";
//import "../../public/css/App.css";

function App() {
  const [doOnce, setDoOnce] = useState(true);
  const [p1ID, setP1ID] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2ID, setP2ID] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [selectedPlayerID, setSelectedPlayerID] = useState(1);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerData, setPlayerData] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [editGameID, setEditGameID] = useState(0);
  const [editGameP1Score, setEditGameP1Score] = useState(0);
  const [editGameP2Score, setEditGameP2Score] = useState(0);

  useEffect(() => {
    if (doOnce) {
      getPlayers();
      setDoOnce(false);
    }
  });

  // Login Button
  let getRequest = async () => {
    await fetch("http://localhost:3000/get/sample/all", {
      method: "GET",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        let dataString = data.text + "\n\n" + JSON.stringify(data.data);
      });
  };

  // Get games
  let getGames = async (idIn) => {
    await fetch("http://localhost:3000/post/games", {
      method: "POST",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: idIn,
      }),
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        //console.log("data.success = " + data.success);

        let gameData = [];
        for (let i = 0; i < data.data.length; i++) {
          gameData.push({
            id: data.data[i].id,
            p1id: data.data[i].p1id,
            p1score: data.data[i].p1score,
            p2id: data.data[i].p2id,
            p2score: data.data[i].p2score,
            serverid: data.data[i].serverid,
          });
        }
        console.log(gameData);

        setGameData(gameData);
      });
  };

  // Login Button
  let getPlayers = async () => {
    await fetch("http://localhost:3000/get/players", {
      method: "GET",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        //let dataString = data.text + "\n\n" + JSON.stringify(data.data);
        let playerData = [];
        for (let i = 0; i < data.data.length; i++) {
          playerData.push({
            id: data.data[i].id,
            name: data.data[i].name,
            wins: data.data[i].wins,
            points: data.data[i].points,
          });
        }
        console.log(playerData);

        // Sort the functions
        playerData.sort(function (a, b) {
          return b.wins - a.wins;
        });

        playerData.sort(function (a, b) {
          if (a.wins === b.wins) {
            return a.points - b.points;
          }
        });

        setPlayerData(playerData);
      });
  };

  // Login Button
  let addPlayerToDatabase = async (nameIn) => {
    await fetch("http://localhost:3000/post/newplayer", {
      method: "POST",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: nameIn,
      }),
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        console.log("data.success = " + data.success);
      });

    getPlayers();
  };

  // Add game to db
  let addGameToDatabase = async (p1ID, p1Score, p2ID, p2Score) => {
    await fetch("http://localhost:3000/post/addgame", {
      method: "POST",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        p1id: p1ID,
        p1score: p1Score,
        p2id: p2ID,
        p2score: p2Score,
        serverid: p1ID,
      }),
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        console.log("data.success = " + data.success);
        getGames(selectedPlayerID);
      });
  };

  // Add game to db
  let updateGameInDatabase = async (gameID, p1Score, p2Score) => {
    await fetch("http://localhost:3000/post/updategame", {
      method: "POST",
      credentials: "include", // required to send cookies (for express-session)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        gameID: gameID,
        p1score: p1Score,
        p2score: p2Score,
      }),
    })
      .then((response) => {
        console.log(`Response arrived...`);
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        console.log("data.success = " + data.success);
        getGames(selectedPlayerID);
      });
  };

  function getNameByID(id) {
    let player = playerData.find((player) => player.id == id);

    if (player.name != undefined && player.name != null) {
      return player.name;
    } else {
      return "Player Name (This is a bug.)";
    }
  }

  function getWinner(p1id, p1score, p2id, p2score) {
    if (p1score > p2score) {
      return getNameByID(p1id);
    } else return getNameByID(p2id);
  }

  function isThereAWinner(p1score, p2score) {
    if (p1score > 10 && p2score < 10) {
      return true;
    } else if (p1score < 10 && p2score > 10) {
      return true;
    } else if (p1score <= 10 && p2score <= 10) {
      return false;
    } else if (p1score > 10 && p2score > 10) {
      let scoreDifference = Math.abs(p1score - p2score);
      if (scoreDifference >= 2) {
        return true;
      } else {
        return false;
      }
    }
  }

  return (
    <>
      <div>
        <h1>Ping Pong</h1>
        <br />
        <b>
          Select Player (Selected: {selectedPlayerName} , ID:{selectedPlayerID})
        </b>
        <br />
        {/* {playerData.map((player) => (
          <Fragment key={Math.random()}>
            <button
              onClick={() => {
                console.log(
                  "selected " + JSON.stringify(player.name + " , " + player.id)
                );
                setSelectedPlayer({ name: player.name, id: player.id });

                // Get that player's games list
                getGames(player.id);
              }}
            >
              {player.name} ({player.id})
            </button>
            <br />
          </Fragment>
        ))} */}
        <select
          id="selected-player"
          onChange={(e) => {
            console.log("selected " + JSON.stringify(e.target.value));
            setSelectedPlayerID(e.target.value);
            // let name = playerData.filter((player) => {
            //   return player.id == e.target.value;
            // });
            let name = getNameByID(e.target.value);
            setSelectedPlayerName(name.name);
            getGames(e.target.value);
          }}
          value={selectedPlayerID}
        >
          {playerData.map((player) => (
            <Fragment key={Math.random()}>
              <option key={Math.random()} value={player.id}>
                {player.name} ({player.id})
              </option>
            </Fragment>
          ))}
        </select>
        <br />
        <b>Or Add Player:</b>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={newPlayerName}
          minLength="1"
          maxLength="32"
          size="16"
          onChange={(e) => setNewPlayerName(e.target.value)}
        ></input>
        <button onClick={() => addPlayerToDatabase(newPlayerName)}>
          Add Player
        </button>
        <br />
        <br />
        <br />
        <b>Game History for {selectedPlayerName}:</b>
        <br />
        {gameData.map((game) => (
          <Fragment key={Math.random()}>
            {isThereAWinner(game.p1score, game.p2score) ? (
              <Fragment key={Math.random()}>
                <b>[ID: {game.id}]</b> {getNameByID(game.p1id)} ({game.p1score}{" "}
                points) VS {getNameByID(game.p2id)} ({game.p2score} points),
                Server: {getNameByID(game.serverid)} ----> WINNER:{" "}
                {getWinner(game.p1id, game.p1score, game.p2id, game.p2score)}
              </Fragment>
            ) : game.id == editGameID ? (
              <>
                {" "}
                <Fragment key={Math.random()}>
                  <div style={{ backgroundColor: "yellow" }}>
                    <b>[ID: {game.id}]</b> {getNameByID(game.p1id)} (
                    <input
                      type="number"
                      id="p1score"
                      min="0"
                      max="500"
                      onChange={(e) => {
                        console.log("score p1 " + e.target.value);
                        setEditGameP1Score(e.target.value);
                      }}
                      value={editGameP1Score}
                    ></input>
                    points) VS {getNameByID(game.p2id)} (
                    <input
                      type="number"
                      id="p1score"
                      min="0"
                      max="500"
                      onChange={(e) => {
                        console.log("score p2 " + e.target.value);
                        setEditGameP2Score(e.target.value);
                      }}
                      value={editGameP2Score}
                    ></input>
                    points), Server: {getNameByID(game.serverid)}, Winner:{" "}
                    {getWinner(
                      game.p1id,
                      game.p1score,
                      game.p2id,
                      game.p2score
                    )}
                    <button
                      onClick={() => {
                        updateGameInDatabase(
                          game.id,
                          editGameP1Score,
                          editGameP2Score
                        );
                        setEditGameID(0);
                      }}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditGameID(0)}>Cancel</button>
                  </div>
                </Fragment>
              </>
            ) : (
              <>
                <Fragment key={Math.random()}>
                  <div style={{ backgroundColor: "yellow" }}>
                    <b>[ID: {game.id}]</b> {getNameByID(game.p1id)} (
                    <u>{game.p1score}</u> points) VS {getNameByID(game.p2id)} (
                    <u>{game.p2score}</u> points), Server:{" "}
                    {getNameByID(game.serverid)} ----> NO
                    WINNER!&nbsp;&nbsp;&nbsp;
                    <button
                      onClick={() => {
                        setEditGameID(game.id);
                        setEditGameP1Score(game.p1score);
                        setEditGameP2Score(game.p2score);
                      }}
                    >
                      Edit Game
                    </button>
                  </div>
                </Fragment>
              </>
            )}
            <br />
          </Fragment>
        ))}
        <br />
        <b>Add Game</b>
        <br />
        P1 (Server):
        <select
          key={Math.random()}
          id="p1"
          onChange={(e) => {
            console.log("selected " + JSON.stringify(e.target.value));
            setP1ID(e.target.value);
          }}
          value={p1ID}
        >
          {playerData.map((player) => (
            <Fragment key={Math.random()}>
              <option key={Math.random()} value={player.id}>
                {player.name} ({player.id})
              </option>
            </Fragment>
          ))}
        </select>
        &nbsp;&nbsp; P1 Score:
        <input
          type="number"
          id="p1score"
          min="0"
          max="500"
          value={p1Score}
          onChange={(e) => {
            console.log("score p1 " + e.target.value);
            setP1Score(e.target.value);
          }}
        ></input>
        &nbsp;&nbsp; P2:
        <select
          id="p2"
          onChange={(e) => {
            console.log("selected " + JSON.stringify(e.target.value));
            setP2ID(e.target.value);
          }}
          value={p2ID}
        >
          {playerData.map((player) => (
            <Fragment key={Math.random()}>
              <option key={Math.random()} value={player.id}>
                {player.name} ({player.id})
              </option>
            </Fragment>
          ))}
        </select>
        &nbsp;&nbsp;Player 2 Score:
        <input
          type="number"
          id="p2score"
          min="0"
          max="500"
          value={p2Score}
          onChange={(e) => {
            console.log("score p2 " + e.target.value);
            setP2Score(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            console.log("Adding game...");
            addGameToDatabase(p1ID, p1Score, p2ID, p2Score);
          }}
        >
          Add Game
        </button>
        <br />
        <br />
        <b>Leaderboard</b>
        <br />
        {playerData.map((player) => (
          <>
            {player.name} , WINS: {player.wins}, POINTS:{player.points}
            <br />
          </>
        ))}
      </div>
    </>
  );
}

export default App;
