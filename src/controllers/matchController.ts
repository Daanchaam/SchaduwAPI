import Match from "../models/matchModel";
import Game from "../models/gamesModel";
import express from "express";
import { setUncaughtExceptionCaptureCallback } from "process";
import setController from "./setController";
import { scoreObject } from "../models/scoreModel";

class matchController {
  /**
   * Start match by creating the teams and the first game and set without points
   */
  startMatch = async (req: express.Request, res: express.Response) => {
    let { team1, team2, serving } = req.body;

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
        message: `Is the serving person not joining the match? Serving person: ${serving}, match players: ${team1[0].name}, ${team2}`,
      });
    }
    const newMatch = new Match({
      team1,
      team2,
      date: {
        startDate: Date.now(),
      },
    });
    const savedMatch = await newMatch.save();
    try {
      await setController.createNewSet(savedMatch._id);
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
  ): Promise<scoreObject> => {
    try {
      const currentMatch = await Match.findById(matchId);
      if (!currentMatch) {
        throw new Error("Match to update score in has not been found");
      }
      let currentScore = currentMatch.score;
      let addScore;
      if (setWinner === 1) {
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
      await Match.findByIdAndUpdate(matchId, { score: addScore });
      return addScore;
    } catch (error) {
      throw new Error(
        "Something went wrong updating the match score" + error.message
      );
    }
  };
}

export default new matchController();
