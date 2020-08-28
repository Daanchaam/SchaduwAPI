import Tiebreak from "../models/tiebreakModel";
import { completeScoreObject, scoreObject } from "../models/scoreModel";

class tiebreakController {
  // Assumptions:
  // Tiebreaks(7) are only played at the end of a set, so the set is always finished after
  // Supertiebreaks(10) have different last points but work in the same principle
  // All tiebreaks only finish after reaching their final point AND having a 2 point difference
  // However, a super tiebreak always ends the match instead of the third set.
  public addScoreForTeam = async (
    winner: number,
    tiebreakId: string
  ): Promise<completeScoreObject> => {
    // Fetch the tiebreak to update
    const currentTiebreak = await Tiebreak.findById(tiebreakId);
    if (!currentTiebreak) {
      throw new Error("Tiebreak to play could not be found");
    }
    // First set the score.
    let score: scoreObject;
    let newServeNecessary: boolean = false;
    if (winner === 1) {
      score = {
        team1: currentTiebreak.score.team1 + 1,
        team2: currentTiebreak.score.team2,
      };
    } else {
      score = {
        team1: currentTiebreak.score.team1,
        team2: currentTiebreak.score.team2 + 1,
      };
    }
    if (score.team1 + score.team2 === 1) {
      newServeNecessary = true;
    }
    // Update the score
    await Tiebreak.findByIdAndUpdate(tiebreakId, { score: score });
    if (currentTiebreak.superTiebreak) {
      // A supertiebreak has to be played instead of regular games
      // If the score of a team is 10 or higher
      if (score.team1 > 9 || score.team2 > 9) {
        // Check if the difference is more than 1 point
        if (Math.abs(score.team1 - score.team2) > 1) {
          // if it is, the tiebreak is done
          const winner = score.team1 > score.team2 ? 1 : 2;
          await this.finishTiebreak(winner, tiebreakId);
          return {
            score: `Match won by team ${winner}`,
            gameFinished: true,
            setFinished: true,
            matchFinished: true,
          };
        }
        // If the difference is only 1 point or less, we don't care about the edge case anymore
      }
      // In fact, we don't even care if it is a supertiebreak anymore
    } else {
      // If we don't know who is serving (in doubles match only)
      // If the score of a team is 7 or higher
      if (score.team1 > 6 || score.team2 > 6) {
        // The same rules apply, just different values
        if (Math.abs(score.team1 - score.team2) > 1) {
          // if it is, the tiebreak is done
          const winner = score.team1 > score.team2 ? 1 : 2;
          await this.finishTiebreak(winner, tiebreakId);
          return {
            score: `Tiebreak won by team ${winner}`,
            gameFinished: true,
            setFinished: true,
          };
        }
      }
    }
    return {
      score: `${score.team1} - ${score.team2}`,
      newServeNecessary,
    };
  };

  /**
   * Make sure to update the tiebreak to display the winner when queried
   * @param {Number} winner the number of the winning team
   * @param {String} tiebreakId the id of the tiebreak
   */
  private finishTiebreak = async (winner: number, tiebreakId: string) => {
    // finish tiebreak
    try {
      await Tiebreak.findByIdAndUpdate(tiebreakId, {
        winner: `team ${winner}`,
        tiebreakFinished: true,
      });
    } catch (error) {
      throw new Error(
        "Something went wrong finishing the tiebreak" + error.message
      );
    }
  };
}

export default new tiebreakController();
