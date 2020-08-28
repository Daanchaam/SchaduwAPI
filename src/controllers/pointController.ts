import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Game, { Game as GameModel } from "../models/gamesModel";
import Tiebreak, { Tiebreak as TiebreakModel } from "../models/tiebreakModel";
import Point from "../models/pointsModel";
import scoreController from "./scoreController";
import express from "express";
import gameController from "./gameController";
import setController from "./setController";
import matchController from "./matchController";

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
    const currentMatch = await Match.findById(matchId);
    if (!currentMatch) {
      return res.status(400).json({
        message: "Match does not exist",
      });
    } else if (currentMatch.winner) {
      // And check if the match has not already been won
      return res.status(400).json({
        message: "Match has already been finished!",
        winner: currentMatch.winner,
      });
    }
    // Check if there even is a set in the match
    const lastSet = await Sets.findById(
      currentMatch.sets[currentMatch.sets.length - 1].id
    );
    if (!lastSet) {
      return res.status(400).json({
        message: "Set not found..",
      });
    }
    // Find the correct game or tiebreak
    // If it is the last set and there is a super tiebreak
    if (currentMatch.sets.length === 3 && currentMatch.superTiebreak) {
      lastGame = await Tiebreak.findById(
        lastSet.games[lastSet.games.length - 1].id
      );
      tiebreak = true;
    } else if (lastSet.games.length === 13) {
      // If it is the 13th game in a set, it is a regular tiebreak
      lastGame = await Tiebreak.findById(lastSet.games[12].id);
      tiebreak = true;
    } else {
      // Otherwise is it just a regular game
      lastGame = await Game.findById(
        lastSet.games[lastSet.games.length - 1].id
      );
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

    // Calculate the score
    const calculatedScore = await scoreController.calculateScore(
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

    // Initialize booleans for end of game, set, match
    let gameFinished: boolean = false;
    let setScore;
    let setFinished: boolean = false;
    let matchScore;
    let matchFinished: boolean = false;
    let newServeNecessary: boolean = false;

    // Add the point to the game
    await gameController.addPointToGame(savedPoint._id, gameId, tiebreak);
    // ------------
    // GAME ACTIONS
    // ------------
    if (calculatedScore.gameFinished) {
      // Finish up things in the game
      // We dont need the response from this since we already know all game details
      await gameController.finishGame(winner, gameId);
      gameFinished = true;
      // -----------
      // SET ACTIONS
      // -----------
      setScore = await setController.updateSetScore(winner, setId);
      if (setScore.setFinished) {
        // Finish things up in the set
        // We dont need the response from this since we still have the winner of the game/set
        await setController.finishSet(winner, setId);
        setFinished = true;
        // -------------
        // MATCH ACTIONS
        // -------------
        matchScore = await matchController.updateMatchScore(winner, matchId);
        if (matchScore.matchFinished) {
          // We're basically done now
          // Finish things up in the match
          await matchController.finishMatch(matchId, matchScore.sets);
          matchFinished = true;
        }
        // But if the match is not finished, we should create a new set!
        // A new set needs a new game, so lets do that first
        // If two sets have been played and a super tiebreak has to be played, create one
        // (There is no way the game is a regular tiebreak in this case, since its the first game of the set)
        let newGameId: string;
        if (currentMatch.sets.length === 2 && currentMatch.superTiebreak) {
          newGameId = await gameController.createNewGame(matchId, true);
          // If we're playing doubles, we don't know who serves next!
          if (currentMatch.team1.length > 1) {
            newServeNecessary = true;
          }
        } else {
          newGameId = await gameController.createNewGame(matchId, false);
          // Same here, doubles are confusing
          if (currentMatch.team1.length > 1) {
            newServeNecessary = true;
          }
        }
        // Now we can create the new set!
        // We know the match is not finished yet, and we created the correct type of game for the new set
        const newSet = await setController.createNewSet(newGameId);
        await matchController.addSetToMatch(newSet, matchId);
      } else {
        // Set is not finished, so we can create a new game in the same set
        // First we have to see whether it is a tiebreak or not
        // In a regular tiebreak, the serve just follows the game pattern
        // So we don't have to do too much for the serving person distinction
        let newGameId: string;
        if (setScore.games.team1 + setScore.games.team2 === 12) {
          newGameId = await gameController.createNewGame(matchId, true);
        } else {
          newGameId = await gameController.createNewGame(matchId, false);
        }
        await setController.addGameToSet(newGameId, setId);
        if (lastSet.games.length === 1 && currentMatch.sets.length === 1) {
          newServeNecessary = true;
        }
      }
    }

    // Return the details
    const response = {
      ...calculatedScore,
      ...setScore,
      ...matchScore,
      gameFinished,
      setFinished,
      matchFinished,
      newServeNecessary,
    };
    res.json({
      ...response,
    });
  };
}

export default new pointController();
