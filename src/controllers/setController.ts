import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Game from "../models/gamesModel";
import Tiebreak from "../models/tiebreakModel";
import { scoreObject, setScoreObject } from "../models/scoreModel";
import matchController from "./matchController";
import serveController from "./serveController";

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
      if (currentSet.games.length > 13) {
        throw new Error("maybe we should start a new set");
      }
      await Sets.findByIdAndUpdate(setId, { $push: { games: { id: gameId } } });
    } catch (error) {
      throw new Error("something went wrong updating the set" + error.message);
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
  ): Promise<setScoreObject> => {
    try {
      const currentSet = await Sets.findById(setId);
      if (!currentSet) {
        throw new Error("Set to update score in has not been found");
      }
      let currentScore = currentSet.score;
      let newScore: { team1: number; team2: number };
      if (gameWinner === 1) {
        newScore = {
          team1: currentScore.team1 + 1,
          team2: currentScore.team2,
        };
      } else {
        newScore = {
          team1: currentScore.team1,
          team2: currentScore.team2 + 1,
        };
      }
      await Sets.findByIdAndUpdate(setId, { score: newScore });

      let setFinished: boolean = false;
      if (newScore.team1 === 7 || newScore.team2 === 7) {
        setFinished = true;
      } else if (newScore.team1 === 6 && newScore.team2 === 6) {
        setFinished = false;
      } else if (
        (newScore.team1 === 6 && newScore.team2 === 5) ||
        (newScore.team1 === 5 && newScore.team2 === 6)
      ) {
        setFinished = false;
      } else if (newScore.team1 === 6 || newScore.team2 === 6) {
        setFinished = true;
      }
      return { games: newScore, setFinished };
    } catch (error) {
      throw new Error(
        "Something went wrong updating the set score" + error.message
      );
    }
  };

  /**
   * Finishes up the set given the winner of the set
   * @param {String} setId the set ID
   */
  public finishSet = async (winner: number, setId: string): Promise<void> => {
    let winnerText = winner === 1 ? "team 1" : "team 2";
    try {
      await Sets.findByIdAndUpdate(setId, { winner: winnerText });
    } catch (error) {
      throw new Error("Something went wrong finishing the set" + error.message);
    }
  };

  /**
   * Creates a new set and adds it to the match.
   * Creates a tiebreak game instead of a regular game if supertiebreak is set to true
   * @param {string} gameId ID of the first game of the set
   * @returns {string} the ID of the new set
   */

  // TODO hier verdergaan. Deze moet nog aangepast worden om echt alleen een nieuwe set te maken,
  // AddsetToMatch wordt toch alleen aangeroepen als er al een match is en een set in zit (je moet eerst
  // die match aanmaken, misshcien nog een foutmelding voor maken)
  // Verder gewoon in de pointcontroller doorgaan
  public createNewSet = async (gameId: string): Promise<string> => {
    try {
      const newSet = new Sets({
        games: [
          {
            id: gameId,
          },
        ],
      });
      const savedSet = await newSet.save();
      return savedSet._id;
    } catch (error) {
      throw new Error(
        "something went wrong creating the new set" + error.message
      );
    }
  };
}

export default new setController();
