"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var matchModel_1 = __importDefault(require("../models/matchModel"));
var setsModel_1 = __importDefault(require("../models/setsModel"));
var gamesModel_1 = __importDefault(require("../models/gamesModel"));
var tiebreakModel_1 = __importDefault(require("../models/tiebreakModel"));
var pointsModel_1 = __importDefault(require("../models/pointsModel"));
var scoreController_1 = __importDefault(require("./scoreController"));
var pointController = /** @class */ (function () {
    function pointController() {
        var _this = this;
        /**
         * Add point to a game given the point structure and the ID of match and game
         */
        this.addPoint = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var winner, cause, matchId, lastGame, tiebreak, existingMatch, lastSet, setId, gameId, calculatedScore, newPoint, savedPoint, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        winner = req.body.winner;
                        cause = req.body.cause;
                        matchId = req.body.matchId;
                        tiebreak = false;
                        // Validate if all parameters have been given
                        if (!winner || !cause || !matchId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Not all fields have been filled in " + req.body,
                                })];
                        }
                        return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        existingMatch = _a.sent();
                        if (!existingMatch) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Match does not exist",
                                })];
                        }
                        else if (existingMatch.winner) {
                            // And check if the match has not already been won
                            return [2 /*return*/, res.status(400).json({
                                    message: "Match has already been finished!",
                                    winner: existingMatch.winner,
                                })];
                        }
                        return [4 /*yield*/, setsModel_1.default.findById(existingMatch.sets[existingMatch.sets.length - 1].id)];
                    case 2:
                        lastSet = _a.sent();
                        if (!lastSet) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Set not found..",
                                })];
                        }
                        if (!(existingMatch.sets.length === 3 && existingMatch.superTiebreak)) return [3 /*break*/, 4];
                        return [4 /*yield*/, tiebreakModel_1.default.findById(lastSet.games[lastSet.games.length - 1].id)];
                    case 3:
                        lastGame = _a.sent();
                        tiebreak = true;
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(lastSet.games.length < 13)) return [3 /*break*/, 6];
                        return [4 /*yield*/, gamesModel_1.default.findById(lastSet.games[lastSet.games.length - 1].id)];
                    case 5:
                        // If it is just a regular game
                        lastGame = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, tiebreakModel_1.default.findById(lastSet.games[12].id)];
                    case 7:
                        // If it is a tiebreak (always the 13th game in a set)
                        lastGame = _a.sent();
                        tiebreak = true;
                        _a.label = 8;
                    case 8:
                        // If it does not exist, return error
                        if (!lastGame) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Game not found",
                                })];
                        }
                        setId = lastSet._id;
                        gameId = lastGame._id;
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 16, , 17]);
                        return [4 /*yield*/, scoreController_1.default.calculateScore(matchId, setId, gameId, winner, tiebreak)];
                    case 10:
                        calculatedScore = _a.sent();
                        newPoint = new pointsModel_1.default({
                            winner: winner,
                            cause: cause,
                            scoreAfter: calculatedScore.score,
                        });
                        return [4 /*yield*/, newPoint.save()];
                    case 11:
                        savedPoint = _a.sent();
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, gamesModel_1.default.findByIdAndUpdate(gameId, {
                                $push: { points: { id: savedPoint._id } },
                            })];
                    case 13:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong, please try again",
                            })];
                    case 15:
                        // Return the details
                        res.json({
                            calculatedScore: calculatedScore,
                        });
                        return [3 /*break*/, 17];
                    case 16:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                message: "something went wrong: " + error_2.message,
                            })];
                    case 17: return [2 /*return*/];
                }
            });
        }); };
    }
    return pointController;
}());
exports.default = new pointController();
