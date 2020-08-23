import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Game from "../models/gamesModel";
import Tiebreak from "../models/tiebreakModel";
import setController from "./setController";
import { completeScoreObject } from "../models/scoreModel";
import express from "express";

class gameController {
  /**
   *
   * @param {number} gameWinner
   * @param {string} gameId
   * @param {string} setId
   * @param {string} matchId
   */
  public finishGame = async (
    gameWinner: number,
    gameId: string,
    setId: string,
    matchId: string
  ): Promise<completeScoreObject> => {
    try {
      // First, get the set score
      const match = await Match.findById(matchId);
      if (!match) {
        throw new Error("Match to finish game in could not be found");
      }
      let sets = match.score;
      let setFinished: boolean = false;
      let matchFinished: boolean = false;
      let newServeNecessary: boolean = false;
      // Set the winner
      await Game.findByIdAndUpdate(gameId, { winner: `team ${gameWinner}` });
      // Update and retrieve the set score
      const games = await setController.updateSetScore(gameWinner, setId);
      // If it is time for a tiebreak, create a new game with 'tiebreak' set to true
      if (games.team1 === 6 && games.team2 === 6) {
        this.createNewGame(matchId, setId, true);
      } else if (
        (games.team1 === 6 && games.team2 === 5) ||
        (games.team1 === 5 && games.team2 === 6)
      ) {
        // If not, create a new game and continue the set
        await this.createNewGame(matchId, setId, false);
      } else if (games.team1 === 6 || games.team2 === 6) {
        // otherwise, finish the set and return the set score
        const finishedSet = await setController.finishSet(
          matchId,
          setId,
          games
        );
        sets = finishedSet.score;
        setFinished = true;
        newServeNecessary = match.team1.length > 1 ? true : false;
        matchFinished = finishedSet.matchFinished || false;
      } else {
        // At last, if the game is not special at all, just continue the set
        try {
          await this.createNewGame(matchId, setId, false);
        } catch (error) {
          if (error.message === "603") {
            return {
              score: `Game won by team ${gameWinner}`,
              games: games,
              gameFinished: true,
              setFinished: setFinished,
              matchFinished: matchFinished,
              sets: sets,
              newServeNecessary: true,
            };
          } else {
            throw new Error("Error after 'createNewGame'" + error.message);
          }
        }
      }
      return {
        score: `Game won by team ${gameWinner}`,
        games: games,
        gameFinished: true,
        setFinished: setFinished,
        matchFinished: matchFinished,
        sets: sets,
        newServeNecessary: newServeNecessary,
      };
    } catch (error) {
      throw new Error("Error in 'finishGame '" + error.message);
    }
  };

  private createNewGame = async (
    matchId: string,
    setId: string,
    tiebreak: boolean
  ): Promise<void> => {
    let newServe;
    try {
      newServe = await this.findOutWhoServesNext(matchId);
    } catch (error) {
      throw new Error("something went terribly wrong " + error.message);
    }
    // Create new game (or tiebreak)
    let savedGame;
    if (tiebreak) {
      const newTiebreak = new Tiebreak({
        startTime: Date.now(),
        tieBreak: true,
      });
      savedGame = await newTiebreak.save();
    } else {
      const newGame = new Game({
        serving: newServe,
        startTime: Date.now(),
      });
      savedGame = await newGame.save();
    }
    await setController.addGameToSet(savedGame._id, setId);
    if (!newServe) {
      throw new Error("603");
    }
    return;
  };

  public findOutWhoServesNext = async (
    matchId: string
  ): Promise<string | undefined> => {
    const currentMatch = await Match.findById(matchId);
    if (!currentMatch) {
      throw new Error("Match to add serving person to could not be found");
    }
    const currentSet = await Sets.findById(
      currentMatch.sets[currentMatch.sets.length - 1].id
    );
    if (!currentSet) {
      throw new Error("Set to search for serving person cannot be found");
    }
    // In the case of a doubles match
    if (currentMatch.team1.length > 1) {
      let pastGame;
      // If there are more than 2 games played in the set, we can find who should serve
      if (currentSet.games.length >= 2) {
        pastGame = await Game.findById(
          currentSet.games[currentSet.games.length - 2].id!
        );
        if (pastGame) {
          if (pastGame.serving === currentMatch.team1[0].name) {
            return currentMatch.team1[1].name;
          } else if (pastGame.serving === currentMatch.team1[1].name) {
            return currentMatch.team1[0].name;
          } else if (pastGame.serving === currentMatch.team2[0].name) {
            return currentMatch.team2[1].name;
          } else if (pastGame.serving === currentMatch.team2[1].name) {
            return currentMatch.team2[0].name;
          }
        } else {
          throw new Error("Game could not be found");
        }
      } else {
        return undefined;
      }
    } else {
      // Singles match, we just look at the past game to see who serves next
      const pastGame = await Game.findById(
        currentSet.games[currentSet.games.length - 1].id
      );
      if (pastGame!.serving === currentMatch.team1[0].name) {
        return currentMatch.team2[0].name;
      } else if (pastGame!.serving === currentMatch.team2[0].name) {
        return currentMatch.team1[0].name;
      } else {
        return undefined;
      }
    }
  };

  public addServing = async (req: express.Request, res: express.Response) => {
    const matchId: string | undefined = req.body.matchId;
    const serving: string | undefined = req.body.serving;
    if (!matchId || !serving) {
      return res.status(400).json({
        message: `not all fields have been filled in ${req.body}`,
      });
    }
    const existingMatch = await Match.findById(matchId);
    if (!existingMatch) {
      return res.status(404).json({
        message: `Match with match ID ${matchId} could not be found`,
      });
    }
    if (
      serving !== existingMatch.team1[0].name &&
      serving !== existingMatch.team1[1].name &&
      serving !== existingMatch.team2[0].name &&
      serving !== existingMatch.team2[1].name
    ) {
      return res.status(400).json({
        message: `serving player ${serving} is not in any of the teams!`,
      });
    }
    const currentSet = await Sets.findById(
      existingMatch.sets[existingMatch.sets.length - 1].id
    );
    const gameId = currentSet!.games[currentSet!.games.length - 1].id;
    try {
      await Game.findByIdAndUpdate(gameId, { serving: serving });
      return res.status(200).json({
        message: `Serving player ${serving} added succesfully`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "something went wrong!" + error.message });
    }
  };
}

export default new gameController();
