CREATE DATABASE nba_players_cards;

CREATE TABLE players_info(
  player_id SERIAL PRIMARY KEY,
  player_name VARCHAR(255),
  player_team VARCHAR(255),
  player_number int,
  player_height VARCHAR(255),
  player_weight int,
  player_overall_rating int,
  player_image VARCHAR(500)
);

SELECT * FROM players_info;