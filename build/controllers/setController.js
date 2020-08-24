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
var matchController_1 = __importDefault(require("./matchController"));
var gameController_1 = __importDefault(require("./gameController"));
var setController = /** @class */ (function () {
    function setController() {
        var _this = this;
        /**
         * Adds a game to a set given both parameters
         *
         * @param {string} gameId the ID of the game to be added to the set
         * @param {string} setId the ID of the set for the game to be added to
         * @returns Nothing
         * @throws Error when there is no set found
         * @throws Error when it is by tennis rules impossible to play another game
         */
        this.addGameToSet = function (gameId, setId) { return __awaiter(_this, void 0, void 0, function () {
            var currentSet, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, setsModel_1.default.findById(setId)];
                    case 1:
                        currentSet = _a.sent();
                        if (!currentSet) {
                            throw new Error("Set to add game to could not be found");
                        }
                        if (currentSet.games.length === 13) {
                            throw new Error("maybe we should start a new set");
                        }
                        return [4 /*yield*/, setsModel_1.default.findByIdAndUpdate(setId, { $push: { games: { id: gameId } } })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("something went wrong updating the set");
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         *
         * @param {number} gameWinner The number of the team that won the game
         * @param {string} setId The ID of the set in which the team won the game
         * @returns {scoreObject} the score in the set
         */
        this.updateSetScore = function (gameWinner, setId) { return __awaiter(_this, void 0, void 0, function () {
            var currentSet, currentScore, addScore, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, setsModel_1.default.findById(setId)];
                    case 1:
                        currentSet = _a.sent();
                        if (!currentSet) {
                            throw new Error("Set to update score in has not been found");
                        }
                        currentScore = currentSet.score;
                        addScore = void 0;
                        if (gameWinner === 1) {
                            addScore = {
                                team1: currentScore.team1 + 1,
                                team2: currentScore.team2,
                            };
                        }
                        else {
                            addScore = {
                                team1: currentScore.team1,
                                team2: currentScore.team2 + 1,
                            };
                        }
                        return [4 /*yield*/, setsModel_1.default.findByIdAndUpdate(setId, { score: addScore })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, addScore];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Something went wrong updating the set score" + error_2.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         *
         * @param {String} matchId the
         * @param {String} setId the set ID
         * @param {scoreObject} score the score in the set in games
         * @returns setIsFinished and the score in sets
         */
        this.finishSet = function (matchId, setId, score) { return __awaiter(_this, void 0, void 0, function () {
            var winner, winnerText, updatedMatch, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        winner = score.team1 > score.team2 ? 1 : 2;
                        winnerText = winner === 1 ? "team 1" : "team 2";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, matchController_1.default.updateMatchScore(winner, matchId)];
                    case 2:
                        updatedMatch = _a.sent();
                        return [4 /*yield*/, setsModel_1.default.findByIdAndUpdate(setId, { winner: winnerText })];
                    case 3:
                        _a.sent();
                        if (!!updatedMatch.matchFinished) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createNewSet(matchId)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, updatedMatch];
                    case 6:
                        error_3 = _a.sent();
                        throw new Error("Something went wrong finishing the set" + error_3.message);
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Creates a new set and adds it to the match.
         * Creates a tiebreak game instead of a regular game if supertiebreak is set to true
         * @param {string} matchId the match ID for the set to be added to
         */
        this.createNewSet = function (matchId, serving) { return __awaiter(_this, void 0, void 0, function () {
            var currentMatch, currentServe, savedGame, newTiebreak, newGame, newSet, savedSet, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        currentMatch = _a.sent();
                        currentServe = serving;
                        if (!!serving) return [3 /*break*/, 3];
                        return [4 /*yield*/, gameController_1.default.findOutWhoServesNext(matchId)];
                    case 2:
                        currentServe = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!currentServe) {
                            throw new Error("Set could not be created because we could not figure out who is serving next");
                        }
                        savedGame = void 0;
                        if (!(currentMatch.superTiebreak && currentMatch.sets.length === 2)) return [3 /*break*/, 5];
                        newTiebreak = new tiebreakModel_1.default({
                            startTime: Date.now(),
                            firstServing: currentServe,
                        });
                        return [4 /*yield*/, newTiebreak.save()];
                    case 4:
                        savedGame = _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        newGame = new gamesModel_1.default({
                            startTime: Date.now(),
                            serving: currentServe,
                        });
                        return [4 /*yield*/, newGame.save()];
                    case 6:
                        savedGame = _a.sent();
                        _a.label = 7;
                    case 7:
                        newSet = new setsModel_1.default({
                            games: [
                                {
                                    id: savedGame._id,
                                },
                            ],
                        });
                        return [4 /*yield*/, newSet.save()];
                    case 8:
                        savedSet = _a.sent();
                        matchController_1.default.addSetToMatch(savedSet._id, matchId);
                        return [3 /*break*/, 10];
                    case 9:
                        error_4 = _a.sent();
                        throw new Error("something went wrong creating the new set" + error_4.message);
                    case 10: return [2 /*return*/];
                }
            });
        }); };
    }
    return setController;
}());
exports.default = new setController();
