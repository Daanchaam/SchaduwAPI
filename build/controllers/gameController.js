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
var setController_1 = __importDefault(require("./setController"));
var gameController = /** @class */ (function () {
    function gameController() {
        var _this = this;
        /**
         *
         * @param {number} gameWinner
         * @param {string} gameId
         * @param {string} setId
         * @param {string} matchId
         */
        this.finishGame = function (gameWinner, gameId, setId, matchId) { return __awaiter(_this, void 0, void 0, function () {
            var match, sets, setFinished, matchFinished, newServeNecessary, games, finishedSet, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        match = _a.sent();
                        if (!match) {
                            throw new Error("Match to finish game in could not be found");
                        }
                        sets = match.score;
                        setFinished = false;
                        matchFinished = false;
                        newServeNecessary = false;
                        // Set the winner
                        return [4 /*yield*/, gamesModel_1.default.findByIdAndUpdate(gameId, { winner: "team " + gameWinner })];
                    case 2:
                        // Set the winner
                        _a.sent();
                        return [4 /*yield*/, setController_1.default.updateSetScore(gameWinner, setId)];
                    case 3:
                        games = _a.sent();
                        if (!(games.team1 === 6 && games.team2 === 6)) return [3 /*break*/, 4];
                        this.createNewGame(matchId, setId, true);
                        return [3 /*break*/, 11];
                    case 4:
                        if (!((games.team1 === 6 && games.team2 === 5) ||
                            (games.team1 === 5 && games.team2 === 6))) return [3 /*break*/, 6];
                        // If not, create a new game and continue the set
                        return [4 /*yield*/, this.createNewGame(matchId, setId, false)];
                    case 5:
                        // If not, create a new game and continue the set
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 6:
                        if (!(games.team1 === 6 || games.team2 === 6)) return [3 /*break*/, 8];
                        return [4 /*yield*/, setController_1.default.finishSet(matchId, setId, games)];
                    case 7:
                        finishedSet = _a.sent();
                        sets = finishedSet.score;
                        setFinished = true;
                        newServeNecessary = match.team1.length > 1 ? true : false;
                        matchFinished = finishedSet.matchFinished || false;
                        return [3 /*break*/, 11];
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.createNewGame(matchId, setId, false)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_1 = _a.sent();
                        if (error_1.message === "603") {
                            return [2 /*return*/, {
                                    score: "Game won by team " + gameWinner,
                                    games: games,
                                    gameFinished: true,
                                    setFinished: setFinished,
                                    matchFinished: matchFinished,
                                    sets: sets,
                                    newServeNecessary: true,
                                }];
                        }
                        else {
                            throw new Error("Error after 'createNewGame'" + error_1.message);
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, {
                            score: "Game won by team " + gameWinner,
                            games: games,
                            gameFinished: true,
                            setFinished: setFinished,
                            matchFinished: matchFinished,
                            sets: sets,
                            newServeNecessary: newServeNecessary,
                        }];
                    case 12:
                        error_2 = _a.sent();
                        throw new Error("Error in 'finishGame '" + error_2.message);
                    case 13: return [2 /*return*/];
                }
            });
        }); };
        this.createNewGame = function (matchId, setId, tiebreak) { return __awaiter(_this, void 0, void 0, function () {
            var newServe, error_3, savedGame, newTiebreak, newGame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findOutWhoServesNext(matchId)];
                    case 1:
                        newServe = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("something went terribly wrong " + error_3.message);
                    case 3:
                        if (!tiebreak) return [3 /*break*/, 5];
                        newTiebreak = new tiebreakModel_1.default({
                            startTime: Date.now(),
                            tieBreak: true,
                        });
                        return [4 /*yield*/, newTiebreak.save()];
                    case 4:
                        savedGame = _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        newGame = new gamesModel_1.default({
                            serving: newServe,
                            startTime: Date.now(),
                        });
                        return [4 /*yield*/, newGame.save()];
                    case 6:
                        savedGame = _a.sent();
                        _a.label = 7;
                    case 7: return [4 /*yield*/, setController_1.default.addGameToSet(savedGame._id, setId)];
                    case 8:
                        _a.sent();
                        if (!newServe) {
                            throw new Error("603");
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.findOutWhoServesNext = function (matchId) { return __awaiter(_this, void 0, void 0, function () {
            var currentMatch, currentSet, pastGame, pastGame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        currentMatch = _a.sent();
                        if (!currentMatch) {
                            throw new Error("Match to add serving person to could not be found");
                        }
                        return [4 /*yield*/, setsModel_1.default.findById(currentMatch.sets[currentMatch.sets.length - 1].id)];
                    case 2:
                        currentSet = _a.sent();
                        if (!currentSet) {
                            throw new Error("Set to search for serving person cannot be found");
                        }
                        if (!(currentMatch.team1.length > 1)) return [3 /*break*/, 6];
                        pastGame = void 0;
                        if (!(currentSet.games.length >= 2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, gamesModel_1.default.findById(currentSet.games[currentSet.games.length - 2].id)];
                    case 3:
                        pastGame = _a.sent();
                        if (pastGame) {
                            if (pastGame.serving === currentMatch.team1[0].name) {
                                return [2 /*return*/, currentMatch.team1[1].name];
                            }
                            else if (pastGame.serving === currentMatch.team1[1].name) {
                                return [2 /*return*/, currentMatch.team1[0].name];
                            }
                            else if (pastGame.serving === currentMatch.team2[0].name) {
                                return [2 /*return*/, currentMatch.team2[1].name];
                            }
                            else if (pastGame.serving === currentMatch.team2[1].name) {
                                return [2 /*return*/, currentMatch.team2[0].name];
                            }
                        }
                        else {
                            throw new Error("Game could not be found");
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, undefined];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, gamesModel_1.default.findById(currentSet.games[currentSet.games.length - 1].id)];
                    case 7:
                        pastGame = _a.sent();
                        if (pastGame.serving === currentMatch.team1[0].name) {
                            return [2 /*return*/, currentMatch.team2[0].name];
                        }
                        else if (pastGame.serving === currentMatch.team2[0].name) {
                            return [2 /*return*/, currentMatch.team1[0].name];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.addServing = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var matchId, serving, existingMatch, currentSet, gameId, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchId = req.body.matchId;
                        serving = req.body.serving;
                        if (!matchId || !serving) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "not all fields have been filled in " + req.body,
                                })];
                        }
                        return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        existingMatch = _a.sent();
                        if (!existingMatch) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Match with match ID " + matchId + " could not be found",
                                })];
                        }
                        if (serving !== existingMatch.team1[0].name &&
                            serving !== existingMatch.team1[1].name &&
                            serving !== existingMatch.team2[0].name &&
                            serving !== existingMatch.team2[1].name) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "serving player " + serving + " is not in any of the teams!",
                                })];
                        }
                        return [4 /*yield*/, setsModel_1.default.findById(existingMatch.sets[existingMatch.sets.length - 1].id)];
                    case 2:
                        currentSet = _a.sent();
                        gameId = currentSet.games[currentSet.games.length - 1].id;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, gamesModel_1.default.findByIdAndUpdate(gameId, { serving: serving })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Serving player " + serving + " added succesfully",
                            })];
                    case 5:
                        error_4 = _a.sent();
                        return [2 /*return*/, res
                                .status(500)
                                .json({ message: "something went wrong!" + error_4.message })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
    }
    return gameController;
}());
exports.default = new gameController();
