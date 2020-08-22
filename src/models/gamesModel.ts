import mongoose, { Schema, Document } from "mongoose";

export interface Game extends Document {
  serving: string;
  tieBreak: boolean;
  winner: string;
  startTime: Date;
  scoreAfter: string;
  points: {
    id: string;
  }[];
}

const gamesSchema: Schema = new mongoose.Schema({
  serving: {
    type: String,
  },
  tieBreak: {
    type: Boolean,
    default: false,
  },
  winner: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  scoreAfter: {
    type: String,
  },
  points: [
    {
      id: {
        type: String,
      },
    },
  ],
});

export default mongoose.model<Game>("games", gamesSchema);
