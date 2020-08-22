import mongoose, { Schema, Document } from "mongoose";

export interface Point extends Document {
  winner: number;
  cause: string;
  playerCaused: string;
  letPlayed: boolean;
  scoreAfter: string;
}

const pointSchema = new Schema({
  winner: {
    type: Number,
  },
  cause: {
    type: String,
  },
  /**
   * This one is only used in double matches, since in singles we can derive the player from the cause
   */
  playerCaused: {
    type: String,
  },
  letPlayed: {
    type: Boolean,
    default: false,
  },
  scoreAfter: {
    type: String,
  },
});

export default mongoose.model<Point>("points", pointSchema);
