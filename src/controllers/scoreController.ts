import Game from "../models/gamesModel";
import Tiebreak from "../models/tiebreakModel";
import Points, { Point } from "../models/pointsModel";
import { completeScoreObject, gameScoreObject } from "../models/scoreModel";
import tiebreakController from "./tiebreakController";

class scoreController {
  public calculateScore = async (
    gameId: string,
    winner: number,
    tiebreak: boolean
  ): Promise<completeScoreObject> => {
    // If the game is a tiebreak, we have a whole different path to follow...
    let tiebreakScore: completeScoreObject = {} as any;
    let regularScore: gameScoreObject = {} as any;
    if (tiebreak) {
      const tiebreak = await Tiebreak.findById(gameId);
      if (tiebreak) {
        tiebreakScore = await tiebreakController.addScoreForTeam(
          winner,
          gameId
        );
      } else {
        throw new Error("Tiebreak has not been found!");
      }
    } else {
      // Just a regular game
      const game = await Game.findById(gameId);
      if (game) {
        // Map points to array, so we can search it
        var playedPoints = game.points.map(function (x: any) {
          return x.id;
        });
        const points = await Points.find({ _id: { $in: playedPoints } });

        // No points have been played, so we start the first one
        if (points.length < 1) {
          return {
            score: winner === 1 ? "15-0" : "0-15",
          };
        }
        // the rest of the calculations are moved to a different function.
        regularScore = await this.calculatePointForTeam(winner, points);
      } else {
        throw new Error("Game has not been found");
      }
    }
    return {
      ...regularScore,
      ...tiebreakScore,
    };
  };

  /**
   * Adds score for the team given
   * @param {Number} team the team to win the point
   * @param {Point} points the list of points already played
   */
  private calculatePointForTeam = async (
    winner: number,
    points: Point[]
  ): Promise<gameScoreObject> => {
    let pointToIncrement = points[points.length - 1].scoreAfter;
    if (winner === 1) {
      if (pointToIncrement === "15-0") {
        return { score: "30-0" };
      } else if (pointToIncrement === "30-0") {
        return { score: "40-0" };
      } else if (pointToIncrement === "40-0") {
        return { score: "game team 1", gameFinished: true };
      } else if (pointToIncrement === "0-15") {
        return { score: "15-15" };
      } else if (pointToIncrement === "0-30") {
        return { score: "15-30" };
      } else if (pointToIncrement === "0-40") {
        return { score: "15-40" };
      } else if (pointToIncrement === "15-15") {
        return { score: "30-15" };
      } else if (pointToIncrement === "30-15") {
        return { score: "40-15" };
      } else if (pointToIncrement === "40-15") {
        return { score: "game team 1", gameFinished: true };
      } else if (pointToIncrement === "15-30") {
        return { score: "30-30" };
      } else if (pointToIncrement === "30-30") {
        return { score: "40-30" };
      } else if (pointToIncrement === "40-30") {
        return { score: "game team 1", gameFinished: true };
      } else if (pointToIncrement === "15-40") {
        return { score: "30-40" };
      } else if (pointToIncrement === "30-40") {
        return { score: "40-40" };
      } else if (pointToIncrement === "40-40") {
        return { score: "adv-40" };
      } else if (pointToIncrement === "adv-40") {
        return { score: "game team 1", gameFinished: true };
      } else if (pointToIncrement === "40-adv") {
        return { score: "40-40" };
      } else {
        throw new Error("Game already finished!");
      }
    } else if (winner === 2) {
      if (pointToIncrement === "15-0") {
        return { score: "15-15" };
      } else if (pointToIncrement === "30-0") {
        return { score: "30-15" };
      } else if (pointToIncrement === "40-0") {
        return { score: "40-15" };
      } else if (pointToIncrement === "0-15") {
        return { score: "0-30" };
      } else if (pointToIncrement === "0-30") {
        return { score: "0-40" };
      } else if (pointToIncrement === "0-40") {
        return { score: "game team 2", gameFinished: true };
      } else if (pointToIncrement === "15-15") {
        return { score: "15-30" };
      } else if (pointToIncrement === "30-15") {
        return { score: "30-30" };
      } else if (pointToIncrement === "30-30") {
        return { score: "30-40" };
      } else if (pointToIncrement === "40-15") {
        return { score: "40-30" };
      } else if (pointToIncrement === "15-30") {
        return { score: "15-40" };
      } else if (pointToIncrement === "15-40") {
        return { score: "game team 2", gameFinished: true };
      } else if (pointToIncrement === "30-40") {
        return { score: "game team 2", gameFinished: true };
      } else if (pointToIncrement === "40-30") {
        return { score: "40-40" };
      } else if (pointToIncrement === "40-40") {
        return { score: "40-adv" };
      } else if (pointToIncrement === "adv-40") {
        return { score: "40-40" };
      } else if (pointToIncrement === "40-adv") {
        return { score: "game team 2", gameFinished: true };
      } else {
        throw new Error("Game already finished!");
      }
    } else {
      throw new Error("Something went completely wrong with the scoring");
    }
  };
}

export default new scoreController();
