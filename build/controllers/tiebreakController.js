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
var tiebreakModel_1 = __importDefault(require("../models/tiebreakModel"));
var setController_1 = __importDefault(require("./setController"));
var tiebreakController = /** @class */ (function () {
    function tiebreakController() {
        var _this = this;
        // Assumptions:
        // Tiebreaks(7) are only played at the end of a set, so the set is always finished after
        // Supertiebreaks(10) have different last points but work in the same principle
        // All tiebreaks only finish after reaching their final point AND having a 2 point difference
        // However, a super tiebreak always ends the match instead of the third set.
        this.addScoreForTeam = function (winner, tiebreakId, setId, matchId) { return __awaiter(_this, void 0, void 0, function () {
            var currentMatch, nOfSets, currentTiebreak, score, finishTiebreak, winner_1, sets, winner_2, sets, matchFinished;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        currentMatch = _a.sent();
                        if (!currentMatch) {
                            throw new Error("Match to play tiebreak in could not be found");
                        }
                        nOfSets = currentMatch.sets.length;
                        return [4 /*yield*/, tiebreakModel_1.default.findById(tiebreakId)];
                    case 2:
                        currentTiebreak = _a.sent();
                        if (!currentTiebreak) {
                            throw new Error("Tiebreak to play could not be found");
                        }
                        if (winner === 1) {
                            score = {
                                team1: currentTiebreak.score.team1 + 1,
                                team2: currentTiebreak.score.team2,
                            };
                        }
                        else {
                            score = {
                                team1: currentTiebreak.score.team1,
                                team2: currentTiebreak.score.team2 + 1,
                            };
                        }
                        return [4 /*yield*/, tiebreakModel_1.default.findByIdAndUpdate(tiebreakId, { score: score })];
                    case 3:
                        _a.sent();
                        if (!(nOfSets === 3 && currentMatch.superTiebreak)) return [3 /*break*/, 6];
                        if (!(score.team1 > 9 || score.team2 > 9)) return [3 /*break*/, 5];
                        if (!(Math.abs(score.team1 - score.team2) > 1)) return [3 /*break*/, 5];
                        winner_1 = score.team1 > score.team2 ? 1 : 2;
                        return [4 /*yield*/, this.finishTiebreak(winner_1, score, tiebreakId, setId, matchId)];
                    case 4:
                        finishTiebreak = _a.sent();
                        sets = finishTiebreak.score;
                        return [2 /*return*/, {
                                score: "Match won by team " + winner_1,
                                gameFinished: true,
                                setFinished: true,
                                matchFinished: true,
                                sets: sets,
                            }];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        if (!(score.team1 > 6 || score.team2 > 6)) return [3 /*break*/, 8];
                        if (!(Math.abs(score.team1 - score.team2) > 1)) return [3 /*break*/, 8];
                        winner_2 = score.team1 > score.team2 ? 1 : 2;
                        return [4 /*yield*/, this.finishTiebreak(winner_2, score, tiebreakId, setId, matchId)];
                    case 7:
                        finishTiebreak = _a.sent();
                        sets = finishTiebreak.score;
                        matchFinished = finishTiebreak.matchFinished || false;
                        return [2 /*return*/, {
                                score: "Tiebreak won by team " + winner_2,
                                gameFinished: true,
                                setFinished: true,
                                matchFinished: matchFinished,
                                sets: sets,
                            }];
                    case 8: return [2 /*return*/, {
                            score: score.team1 + " - " + score.team2,
                        }];
                }
            });
        }); };
        this.finishTiebreak = function (winner, score, tiebreakId, setId, matchId) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, setController_1.default.updateSetScore(winner, setId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tiebreakModel_1.default.findByIdAndUpdate(tiebreakId, {
                                winner: "team " + winner,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, setController_1.default.finishSet(matchId, setId, score)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        throw new Error("Something went wrong finishing the tiebreak" + error_1.message);
                    case 5: return [2 /*return*/];
                }
            });
        }); };
    }
    return tiebreakController;
}());
exports.default = new tiebreakController();
