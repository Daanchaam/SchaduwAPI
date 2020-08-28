import Match from "../models/matchModel";
import Sets from "../models/setsModel";
import Tiebreak from "../models/tiebreakModel";
import Game from "../models/gamesModel";
import express from "express";

class serveController {
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
        // Otherwise we look in the most recently finished game
        pastGame = await Game.findById(
          currentSet.games[currentSet.games.length - 2].id
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
          } else {
            return undefined;
          }
        } else {
          throw new Error("Game could not be found");
        }
      } else {
        return undefined;
      }
    } else {
      let pastGame;
      // Singles match, we just look at the past game to see who serves next
      // If its a tiebreak, we need to look there
      if (currentSet.games.length === 13) {
        pastGame = await Tiebreak.findById(currentSet.games[12].id);
      } else {
        // Otherwise we look in the most recently finished game
        pastGame = await Game.findById(
          currentSet.games[currentSet.games.length - 1].id
        );
      }
      if (pastGame) {
        if (pastGame!.serving === currentMatch.team1[0].name) {
          return currentMatch.team2[0].name;
        } else if (pastGame!.serving === currentMatch.team2[0].name) {
          return currentMatch.team1[0].name;
        } else {
          return undefined;
        }
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

export default new serveController();
