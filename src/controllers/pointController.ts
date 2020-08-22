import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Game from "../models/gamesModel";
import Point from "../models/pointsModel";
import scoreController from "./scoreController";
import express from "express";

class pointController {
  /**
   * Add point to a game given the point structure and the ID of match and game
   */
  addPoint = async (req: express.Request, res: express.Response) => {
    const winner: number | undefined = req.body.winner;
    const cause: string | undefined = req.body.cause;
    const letPlayed: boolean | undefined = req.body.letPlayed;
    const matchId: string | undefined = req.body.matchId;

    // Validate if all parameters have been given
    if (!winner || !cause || !matchId) {
      return res.status(400).json({
        message: `Not all fields have been filled in ${req.body}`,
      });
    }
    // Check if match exists
    const existingMatch = await Match.findById(matchId);
    if (!existingMatch) {
      return res.status(400).json({
        message: "Match does not exist",
      });
    } else if (existingMatch.winner) {
      return res.status(400).json({
        message: "Match has already been finished!",
        winner: existingMatch.winner,
      });
    }
    // Check if there even is a set in the match
    const lastSet = await Sets.findById(
      existingMatch.sets[existingMatch.sets.length - 1].id
    );
    if (!lastSet) {
      return res.status(400).json({
        message: "Set not found..",
      });
    }
    // Check if there is a game in the set and pick it
    const lastGame = await Game.findById(
      lastSet.games[lastSet.games.length - 1].id
    );
    if (!lastGame) {
      return res.status(400).json({
        message: "Game not found",
      });
    }
    const setId: string = lastSet._id;
    const gameId: string = lastGame._id;
    // From here on we can assume there is a game that is currently being played
    try {
      // Calculate the score
      const calculatedScore = await scoreController.calculateScore(
        matchId,
        setId,
        gameId,
        winner
      );

      // Create the point
      const newPoint = new Point({
        winner,
        cause,
        letPlayed,
        scoreAfter: calculatedScore.score,
      });
      const savedPoint = await newPoint.save();

      // Add the point to the game
      try {
        await Game.findByIdAndUpdate(gameId, {
          $push: { points: { id: savedPoint._id } },
        });
      } catch (error) {
        return res.status(500).json({
          message: "Something went wrong, please try again",
        });
      }
      // Return the details
      res.json({
        calculatedScore,
      });
    } catch (error) {
      return res.status(400).json({
        message: "something went wrong: " + error.message,
      });
    }
  };
}

export default new pointController();
