import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Tiebreak from "../models/tiebreakModel";
import {
  completeScoreObject,
  scoreObject,
  matchScoreObject,
} from "../models/scoreModel";
import setController from "./setController";

class tiebreakController {
  // Assumptions:
  // Tiebreaks(7) are only played at the end of a set, so the set is always finished after
  // Supertiebreaks(10) have different last points but work in the same principle
  // All tiebreaks only finish after reaching their final point AND having a 2 point difference
  // However, a super tiebreak always ends the match instead of the third set.
  public addScoreForTeam = async (
    winner: number,
    tiebreakId: string,
    setId: string,
    matchId: string
  ): Promise<completeScoreObject> => {
    // Fetch the match, see if it is a regular or a super tiebreak
    const currentMatch = await Match.findById(matchId);
    if (!currentMatch) {
      throw new Error("Match to play tiebreak in could not be found");
    }
    const nOfSets = currentMatch.sets.length;
    const currentTiebreak = await Tiebreak.findById(tiebreakId);
    if (!currentTiebreak) {
      throw new Error("Tiebreak to play could not be found");
    }
    // First set the score.
    let score: scoreObject;
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
    await Tiebreak.findByIdAndUpdate(tiebreakId, { score: score });
    let finishTiebreak: matchScoreObject;
    if (nOfSets === 3 && currentMatch.superTiebreak) {
      // A supertiebreak has to be played instead of regular games
      // If the score of a team is 10 or higher
      if (score.team1 > 9 || score.team2 > 9) {
        // Check if the difference is more than 1 point
        if (Math.abs(score.team1 - score.team2) > 1) {
          // if it is, the tiebreak is done
          const winner = score.team1 > score.team2 ? 1 : 2;
          finishTiebreak = await this.finishTiebreak(
            winner,
            score,
            tiebreakId,
            setId,
            matchId
          );
          const sets = finishTiebreak.score;
          return {
            score: `Match won by team ${winner}`,
            gameFinished: true,
            setFinished: true,
            matchFinished: true,
            sets: sets,
          };
        }
        // If the difference is only 1 point or less, we don't care about the edge case anymore
      }
      // In fact, we don't even care if it is a supertiebreak anymore
    } else {
      // If the score of a team is 7 or higher
      if (score.team1 > 6 || score.team2 > 6) {
        // The same rules apply, just different values
        if (Math.abs(score.team1 - score.team2) > 1) {
          // if it is, the tiebreak is done
          const winner = score.team1 > score.team2 ? 1 : 2;
          finishTiebreak = await this.finishTiebreak(
            winner,
            score,
            tiebreakId,
            setId,
            matchId
          );
          const sets = finishTiebreak.score;
          const matchFinished = finishTiebreak.matchFinished || false;
          return {
            score: `Tiebreak won by team ${winner}`,
            gameFinished: true,
            setFinished: true,
            matchFinished: matchFinished,
            sets: sets,
          };
        }
      }
    }

    return {
      score: `${score.team1} - ${score.team2}`,
    };
  };

  private finishTiebreak = async (
    winner: number,
    score: scoreObject,
    tiebreakId: string,
    setId: string,
    matchId: string
  ): Promise<matchScoreObject> => {
    // finish tiebreak
    try {
      await setController.updateSetScore(winner, setId);
      await Tiebreak.findByIdAndUpdate(tiebreakId, {
        winner: `team ${winner}`,
      });
      return await setController.finishSet(matchId, setId, score);
    } catch (error) {
      throw new Error(
        "Something went wrong finishing the tiebreak" + error.message
      );
    }
  };
}

export default new tiebreakController();
