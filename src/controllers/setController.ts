import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Game from "../models/gamesModel";
import Tiebreak from "../models/tiebreakModel";
import { scoreObject, matchScoreObject } from "../models/scoreModel";
import matchController from "./matchController";

class setController {
  /**
   * Adds a game to a set given both parameters
   *
   * @param {string} gameId the ID of the game to be added to the set
   * @param {string} setId the ID of the set for the game to be added to
   * @returns Nothing
   * @throws Error when there is no set found
   * @throws Error when it is by tennis rules impossible to play another game
   */
  public addGameToSet = async (gameId: string, setId: string) => {
    try {
      const currentSet = await Sets.findById(setId);
      if (!currentSet) {
        throw new Error("Set to add game to could not be found");
      }
      if (currentSet.games.length === 13) {
        throw new Error("maybe we should start a new set");
      }
      await Sets.findByIdAndUpdate(setId, { $push: { games: { id: gameId } } });
    } catch (error) {
      throw new Error("something went wrong updating the set");
    }
  };

  /**
   *
   * @param {number} gameWinner The number of the team that won the game
   * @param {string} setId The ID of the set in which the team won the game
   * @returns {scoreObject} the score in the set
   */
  public updateSetScore = async (
    gameWinner: number,
    setId: string
  ): Promise<scoreObject> => {
    try {
      const currentSet = await Sets.findById(setId);
      if (!currentSet) {
        throw new Error("Set to update score in has not been found");
      }
      let currentScore = currentSet.score;
      let addScore;
      if (gameWinner === 1) {
        addScore = {
          team1: currentScore.team1 + 1,
          team2: currentScore.team2,
        };
      } else {
        addScore = {
          team1: currentScore.team1,
          team2: currentScore.team2 + 1,
        };
      }
      await Sets.findByIdAndUpdate(setId, { score: addScore });
      return addScore;
    } catch (error) {
      throw new Error(
        "Something went wrong updating the set score" + error.message
      );
    }
  };

  /**
   *
   * @param {String} matchId the
   * @param {String} setId the set ID
   * @param {scoreObject} score the score in the set in games
   * @returns setIsFinished and the score in sets
   */
  public finishSet = async (
    matchId: string,
    setId: string,
    score: scoreObject
  ): Promise<matchScoreObject> => {
    let winner = score.team1 > score.team2 ? 1 : 2;
    let winnerText = winner === 1 ? "team 1" : "team 2";
    try {
      // Update the match score
      const updatedMatch = await matchController.updateMatchScore(
        winner,
        matchId
      );
      await Sets.findByIdAndUpdate(setId, { winner: winnerText });
      if (!updatedMatch.matchFinished) {
        await this.createNewSet(matchId);
      }
      return updatedMatch;
    } catch (error) {
      throw new Error("Something went wrong finishing the set" + error.message);
    }
  };

  /**
   * Creates a new set and adds it to the match.
   * Creates a tiebreak game instead of a regular game if supertiebreak is set to true
   * @param {string} matchId the match ID for the set to be added to
   */
  public createNewSet = async (matchId: string) => {
    try {
      const currentMatch = await Match.findById(matchId);
      let savedGame;
      if (currentMatch?.superTiebreak && currentMatch.sets.length === 2) {
        console.log("match should have a supertiebreak now??");
        const newTiebreak = new Tiebreak({
          startTime: Date.now(),
        });
        savedGame = await newTiebreak.save();
      } else {
        const newGame = new Game({
          startTime: Date.now(),
        });
        savedGame = await newGame.save();
      }

      const newSet = new Sets({
        games: [
          {
            id: savedGame._id,
          },
        ],
      });
      const savedSet = await newSet.save();
      matchController.addSetToMatch(savedSet._id, matchId);
    } catch (error) {
      throw new Error(
        "something went wrong creating the new set" + error.message
      );
    }
  };
}

export default new setController();
