import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Game, { Game as GameModel } from "../models/gamesModel";
import Tiebreak, { Tiebreak as TiebreakModel } from "../models/tiebreakModel";
import Point from "../models/pointsModel";
import scoreController from "./scoreController";
import express from "express";

class pointController {
  /**
   * Add point to a game given the point structure and the ID of match and game
   */
  public addPoint = async (req: express.Request, res: express.Response) => {
    const winner: number | undefined = req.body.winner;
    const cause: string | undefined = req.body.cause;
    const matchId: string | undefined = req.body.matchId;

    let lastGame: GameModel | TiebreakModel | null;
    let tiebreak: boolean = false;

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
      // And check if the match has not already been won
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
    // Find the correct game or tiebreak
    // If it is the last set and there is a super tiebreak
    if (existingMatch.sets.length === 3 && existingMatch.superTiebreak) {
      lastGame = await Tiebreak.findById(
        lastSet.games[lastSet.games.length - 1].id
      );
      tiebreak = true;
    } else if (lastSet.games.length < 13) {
      // If it is just a regular game
      lastGame = await Game.findById(
        lastSet.games[lastSet.games.length - 1].id
      );
    } else {
      // If it is a tiebreak (always the 13th game in a set)
      lastGame = await Tiebreak.findById(lastSet.games[12].id);
      tiebreak = true;
    }
    // If it does not exist, return error
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
        winner,
        tiebreak
      );

      // Create the point
      const newPoint = new Point({
        winner,
        cause,
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
