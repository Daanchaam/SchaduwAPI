export interface completeScoreObject {
  score: string;
  games?: {
    team1: number;
    team2: number;
  };
  sets?: {
    team1: number;
    team2: number;
  };
  gameFinished?: boolean;
  setFinished?: boolean;
  matchFinished?: boolean;
  newServeNecessary?: boolean;
}

export interface matchScoreObject {
  score: scoreObject;
  matchFinished?: boolean;
}

export interface scoreObject {
  team1: number;
  team2: number;
}
