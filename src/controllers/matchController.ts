import Match from "../models/matchModel";
import express from "express";
import setController from "./setController";
import { scoreObject, matchScoreObject } from "../models/scoreModel";

class matchController {
  /**
   * Start match by creating the teams and the first game and set without points
   */
  public startMatch = async (req: express.Request, res: express.Response) => {
    let { team1, team2, serving, superTiebreak } = req.body;

    // Validation
    if (!team1 || !team2 || !serving) {
      return res.status(400).json({
        message: "Not all fields have been filled in",
      });
    }
    if (team1.length !== team2.length) {
      return res.status(400).json({
        message:
          "This match seems unfair, please select an equal number of players on both sides",
      });
    }
    if (
      !team1.some((e: any) => e.name === serving) &&
      !team2.some((e: any) => e.name === serving)
    ) {
      return res.status(400).json({
        message: `Is the serving person not joining the match?`,
      });
    }
    const newMatch = new Match({
      team1,
      team2,
      date: {
        startDate: Date.now(),
      },
      superTiebreak,
    });
    const savedMatch = await newMatch.save();
    try {
      await setController.createNewSet(savedMatch._id, serving);
    } catch (error) {
      throw new Error("Set could not be added to the match!" + error.message);
    }
    res.json({
      message: "Match started!",
      matchId: savedMatch._id,
    });
  };

  /**
   * Adds a set to a match given both ID's
   * @param {string} setId The ID of the set that has to be added to the match
   * @param {string} matchId the ID of the match that the set has to be added to
   */
  public addSetToMatch = async (setId: string, matchId: string) => {
    try {
      const currentMatch = await Match.findById(matchId);
      if (!currentMatch) {
        throw new Error("Match could not be found");
      }
      if (currentMatch.sets.length > 2) {
        throw new Error("Are we playing a 5-set match?");
      }
      await Match.findByIdAndUpdate(matchId, {
        $push: { sets: { id: setId } },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong adding the set to the match" + error.message
      );
    }
  };

  public updateMatchScore = async (
    setWinner: number,
    matchId: string
  ): Promise<matchScoreObject> => {
    try {
      const currentMatch = await Match.findById(matchId);
      if (!currentMatch) {
        throw new Error("Match to update score in has not been found");
      }
      let currentScore = currentMatch.score;
      let newScore;
      let matchFinished: boolean = false;
      if (setWinner === 1) {
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
      await Match.findByIdAndUpdate(matchId, { score: newScore });
      if (newScore.team1 === 2 || newScore.team2 === 2) {
        this.finishMatch(matchId, newScore);
        matchFinished = true;
      }
      return {
        matchFinished,
        score: newScore,
      };
    } catch (error) {
      throw new Error(
        "Something went wrong updating the match score" + error.message
      );
    }
  };

  private finishMatch = async (matchId: string, finalScore: scoreObject) => {
    const winner = finalScore.team1 === 2 ? "team 1" : "team 2";
    try {
      await Match.findByIdAndUpdate(matchId, {
        winner: winner,
        "date.endDate": Date.now(),
      });
    } catch (error) {
      throw new Error("Something went wrong trying to finish the match");
    }
  };
}

export default new matchController();
