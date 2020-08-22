import mongoose, { Schema, Document } from "mongoose";

export interface Set extends Document {
  winner?: string;
  score: {
    team1: number;
    team2: number;
  };
  games: {
    id?: string;
  }[];
}

const setSchema: Schema = new Schema({
  winner: {
    type: String,
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
  games: [
    {
      id: {
        type: String,
      },
    },
  ],
});

export default mongoose.model<Set>("sets", setSchema);
