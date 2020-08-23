import Match from "../models/matchModel";
import Game from "../models/gamesModel";
import Tiebreak from "../models/tiebreakModel";
import setController from "./setController";
import { completeScoreObject } from "../models/scoreModel";

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
      // Set the winner
      await Game.findByIdAndUpdate(gameId, { winner: `team ${gameWinner}` });
      // Update and retrieve the set score
      const games = await setController.updateSetScore(gameWinner, setId);
      // If it is time for a tiebreak, create a new game with 'tiebreak' set to true
      if (games.team1 === 6 && games.team2 === 6) {
        this.createNewGame(setId, true);
      } else if (
        (games.team1 === 6 && games.team2 === 5) ||
        (games.team1 === 5 && games.team2 === 6)
      ) {
        // If so, create a new game and continue the set
        await this.createNewGame(setId, false);
      } else if (games.team1 === 6 || games.team2 === 6) {
        // otherwise, finish the set and return the set score
        const finishedSet = await setController.finishSet(
          matchId,
          setId,
          games
        );
        sets = finishedSet.score;
        setFinished = true;
        matchFinished = finishedSet.matchFinished || false;
      } else {
        await this.createNewGame(setId, false);
      }
      return {
        score: `Game won by team ${gameWinner}`,
        games: games,
        gameFinished: true,
        setFinished: setFinished,
        matchFinished: matchFinished,
        sets: sets,
      };
    } catch (error) {
      throw new Error(
        "Something went wrong trying to finish the game" + error.message
      );
    }
  };

  private createNewGame = async (
    setId: string,
    tiebreak: boolean
  ): Promise<void> => {
    let savedGame;
    if (tiebreak) {
      const newTiebreak = new Tiebreak({
        startTime: Date.now(),
        tieBreak: true,
      });
      savedGame = await newTiebreak.save();
    } else {
      const newGame = new Game({
        startTime: Date.now(),
      });
      savedGame = await newGame.save();
    }
    try {
      await setController.addGameToSet(savedGame._id, setId);
      return;
    } catch (error) {
      throw new Error("Something went wrong adding the game to the set");
    }
  };
}

export default new gameController();
