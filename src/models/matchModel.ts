import mongoose, { Schema, Document } from "mongoose";

export interface Match extends Document {
  team1: {
    name: string;
  }[];
  team2: {
    name: string;
  }[];
  date: {
    startDate: Date;
    endDate: Date;
  };
  sets: {
    id: string;
  }[];
  winner: string;
  score: {
    team1: number;
    team2: number;
  };
  superTiebreak: boolean;
}

const matchSchema = new Schema({
  team1: [
    {
      name: {
        type: String,
      },
    },
  ],
  team2: [
    {
      name: {
        type: String,
      },
    },
  ],
  date: {
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
    },
  },
  sets: [
    {
      id: {
        type: String,
      },
    },
  ],
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
  superTiebreak: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<Match>("match", matchSchema);
