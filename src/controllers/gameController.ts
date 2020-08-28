import Game from "../models/gamesModel";
import Tiebreak from "../models/tiebreakModel";
import serveController from "./serveController";

class gameController {
  /**
   * Appends the point ID to the list of points in the game
   * @param pointId The ID of the point to be added to the game
   * @param gameId The ID of the game to add the point to
   */
  public addPointToGame = async (
    pointId: string,
    gameId: string,
    tiebreak: boolean
  ): Promise<void> => {
    try {
      if (tiebreak) {
        await Tiebreak.findByIdAndUpdate(gameId, {
          $push: { points: { id: pointId } },
        });
      }
      await Game.findByIdAndUpdate(gameId, {
        $push: { points: { id: pointId } },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong adding the point to the game" + error.message
      );
    }
  };

  /**
   *
   * @param {number} gameWinner
   * @param {string} gameId
   * @param {string} setId
   */
  public finishGame = async (
    gameWinner: number,
    gameId: string
  ): Promise<void> => {
    try {
      // Set the winner
      await Game.findByIdAndUpdate(gameId, { winner: `team ${gameWinner}` });
      return;
    } catch (error) {
      throw new Error("Error in 'finishGame '" + error.message);
    }
  };

  /**
   *
   * @param {string} matchId ID of the match to add the game to
   * @param {boolean} tiebreak whether the game should be a tiebreak
   * @param {string} serving? Whether we know who is serving.
   * @returns {string} game id of the new game
   */
  public createNewGame = async (
    matchId: string,
    tiebreak: boolean,
    serving?: string
  ): Promise<string> => {
    let newServe: string | undefined;
    if (!serving) {
      newServe = await serveController.findOutWhoServesNext(matchId);
      if (!newServe) {
        newServe = "We don't know yet";
      }
    } else {
      newServe = serving;
    }
    // Create new game (or tiebreak)
    let savedGame;
    if (tiebreak) {
      const newTiebreak = new Tiebreak({
        startTime: Date.now(),
        tieBreak: true,
        serving: newServe,
      });
      savedGame = await newTiebreak.save();
    } else {
      const newGame = new Game({
        serving: newServe,
        startTime: Date.now(),
      });
      savedGame = await newGame.save();
    }
    if (!newServe) {
      throw new Error("603");
    }
    return savedGame._id;
  };
}

export default new gameController();
