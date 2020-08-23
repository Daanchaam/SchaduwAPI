import mongoose, { Schema, Document } from "mongoose";

export interface Tiebreak extends Document {
  firstServing: string;
  winner: string;
  startTime: Date;
  score: {
    team1: number;
    team2: number;
  };
  points: {
    id: string;
  }[];
  tiebreakFinished?: boolean;
}

const tiebreakSchema: Schema = new Schema({
  firstServing: {
    type: String,
  },
  winner: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  score: {
    team1: {
      type: Number,
      default: 0,
    },
    team2: {
      type: Number,
      default: 0,
    },
  },
  points: [
    {
      id: {
        type: String,
      },
    },
  ],
  tiebreakFinished: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<Tiebreak>("tiebreaks", tiebreakSchema);
