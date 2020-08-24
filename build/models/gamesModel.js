"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var gamesSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("games", gamesSchema);
