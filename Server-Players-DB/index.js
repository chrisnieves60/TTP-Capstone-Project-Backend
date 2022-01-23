const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression"); // import compression to reduce size of response
//const bcrypt = require("bcrypt"); // hash password
const port = 5000;
const pool = require("./db");

//middleware
app.use(compression()); // use compression middleware
app.use(cors());
app.use(express.json());

//Listen to port
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

//--------------------------- ROUTES --------------------------
// Columns:
// player_id
// player_name
// player_team
// player_number
// player_height
// player_weight
// player_overall_rating
// player_image

//1- Create a new player's card
app.post("/players_cards", async (req, res) => {
  try {
    const player_name = req.body.playerName;
    const player_team = req.body.playerTeam;
    const player_number = req.body.playerNumber;
    const player_height = req.body.playerHeight;
    const player_weight = req.body.playerWeight;
    const player_overall_rating = req.body.playerOverallRating;
    const player_image = req.body.playerImage;

    const newPlayer = await pool.query(
      "INSERT INTO players_info (player_name, player_team, player_number, player_height, player_weight, player_overall_rating, player_image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        player_name,
        player_team,
        player_number,
        player_height,
        player_weight,
        player_overall_rating,
        player_image,
      ]
    );
    res.json(newPlayer.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//2- Get all players' cards
app.get("/players_cards", async (req, res) => {
  try {
    const allPlayers = await pool.query("SELECT * FROM players_info");
    res.json(allPlayers.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//3- Get one player's card (needs id)
app.get("/players_cards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const player = await pool.query(
      "SELECT * FROM players_info WHERE player_id = $1",
      [id]
    );
    res.json(player.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//4- Update a player's card (needs id)
app.put("/players_cards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const new_player_name = req.body.newPlayerName;
    const new_player_team = req.body.newPlayerTeam;
    const new_player_number = req.body.newPlayerNumber;
    const new_player_height = req.body.newPlayerHeight;
    const new_player_weight = req.body.newPlayerWeight;
    const new_player_overall_rating = req.body.newPlayerOverallRating;
    const new_player_image = req.body.newPlayerImage;

    const updatePlayer = await pool.query(
      "UPDATE players_info SET player_name = $1, player_team = $2, player_number = $3, player_height = $4, player_weight = $5, player_overall_rating = $6, player_image = $7 WHERE player_id = $8",
      [
        new_player_name,
        new_player_team,
        new_player_number,
        new_player_height,
        new_player_weight,
        new_player_overall_rating,
        new_player_image,
        id,
      ]
    );
    res.json("Player was updated");
  } catch (error) {
    console.error(error.message);
  }
});

//5- Delete a player's card (needs id)
app.delete("/players_cards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePlayer = await pool.query(
      "DELETE FROM players_info WHERE player_id = $1",
      [id]
    );
    res.json("Player Was Deleted!"); 
  } catch (error) {
    console.error(error.message);
  }
});
