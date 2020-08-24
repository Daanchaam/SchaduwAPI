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
var gamesModel_1 = __importDefault(require("../models/gamesModel"));
var tiebreakModel_1 = __importDefault(require("../models/tiebreakModel"));
var pointsModel_1 = __importDefault(require("../models/pointsModel"));
var gameController_1 = __importDefault(require("./gameController"));
var tiebreakController_1 = __importDefault(require("./tiebreakController"));
var scoreController = /** @class */ (function () {
    function scoreController() {
        var _this = this;
        this.calculateScore = function (matchId, setId, gameId, winner, tiebreak) { return __awaiter(_this, void 0, void 0, function () {
            var tiebreak_1, game, playedPoints, points;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tiebreak) return [3 /*break*/, 5];
                        return [4 /*yield*/, tiebreakModel_1.default.findById(gameId)];
                    case 1:
                        tiebreak_1 = _a.sent();
                        if (!tiebreak_1) return [3 /*break*/, 3];
                        return [4 /*yield*/, tiebreakController_1.default.addScoreForTeam(winner, gameId, setId, matchId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error("Tiebreak has not been found!");
                    case 4: return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, gamesModel_1.default.findById(gameId)];
                    case 6:
                        game = _a.sent();
                        if (!game) return [3 /*break*/, 9];
                        playedPoints = game.points.map(function (x) {
                            return x.id;
                        });
                        return [4 /*yield*/, pointsModel_1.default.find({ _id: { $in: playedPoints } })];
                    case 7:
                        points = _a.sent();
                        // No points have been played, so we start the first one
                        if (points.length < 1) {
                            return [2 /*return*/, {
                                    score: winner === 1 ? "15-0" : "0-15",
                                }];
                        }
                        return [4 /*yield*/, this.addScoreForTeam(winner, points, gameId, setId, matchId)];
                    case 8: 
                    // the rest of the calculations are moved to a different function.
                    return [2 /*return*/, _a.sent()];
                    case 9: throw new Error("Game has not been found");
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Adds score for the team given
         * @param {Number} team the team to win the point
         * @param {Point} points the list of points already played
         */
        this.addScoreForTeam = function (winner, points, gameId, setId, matchId) { return __awaiter(_this, void 0, void 0, function () {
            var pointToIncrement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pointToIncrement = points[points.length - 1].scoreAfter;
                        if (!(winner === 1)) return [3 /*break*/, 22];
                        if (!(pointToIncrement === "15-0")) return [3 /*break*/, 1];
                        return [2 /*return*/, { score: "30-0" }];
                    case 1:
                        if (!(pointToIncrement === "30-0")) return [3 /*break*/, 2];
                        return [2 /*return*/, { score: "40-0" }];
                    case 2:
                        if (!(pointToIncrement === "40-0")) return [3 /*break*/, 4];
                        return [4 /*yield*/, gameController_1.default.finishGame(1, gameId, setId, matchId)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (!(pointToIncrement === "0-15")) return [3 /*break*/, 5];
                        return [2 /*return*/, { score: "15-15" }];
                    case 5:
                        if (!(pointToIncrement === "0-30")) return [3 /*break*/, 6];
                        return [2 /*return*/, { score: "15-30" }];
                    case 6:
                        if (!(pointToIncrement === "0-40")) return [3 /*break*/, 7];
                        return [2 /*return*/, { score: "15-40" }];
                    case 7:
                        if (!(pointToIncrement === "15-15")) return [3 /*break*/, 8];
                        return [2 /*return*/, { score: "30-15" }];
                    case 8:
                        if (!(pointToIncrement === "30-15")) return [3 /*break*/, 9];
                        return [2 /*return*/, { score: "40-15" }];
                    case 9:
                        if (!(pointToIncrement === "40-15")) return [3 /*break*/, 11];
                        return [4 /*yield*/, gameController_1.default.finishGame(1, gameId, setId, matchId)];
                    case 10: return [2 /*return*/, _a.sent()];
                    case 11:
                        if (!(pointToIncrement === "15-30")) return [3 /*break*/, 12];
                        return [2 /*return*/, { score: "30-30" }];
                    case 12:
                        if (!(pointToIncrement === "30-30")) return [3 /*break*/, 13];
                        return [2 /*return*/, { score: "40-30" }];
                    case 13:
                        if (!(pointToIncrement === "40-30")) return [3 /*break*/, 15];
                        return [4 /*yield*/, gameController_1.default.finishGame(1, gameId, setId, matchId)];
                    case 14: return [2 /*return*/, _a.sent()];
                    case 15:
                        if (!(pointToIncrement === "15-40")) return [3 /*break*/, 16];
                        return [2 /*return*/, { score: "30-40" }];
                    case 16:
                        if (!(pointToIncrement === "30-40")) return [3 /*break*/, 17];
                        return [2 /*return*/, { score: "40-40" }];
                    case 17:
                        if (!(pointToIncrement === "40-40")) return [3 /*break*/, 18];
                        return [2 /*return*/, { score: "adv-40" }];
                    case 18:
                        if (!(pointToIncrement === "adv-40")) return [3 /*break*/, 20];
                        return [4 /*yield*/, gameController_1.default.finishGame(1, gameId, setId, matchId)];
                    case 19: return [2 /*return*/, _a.sent()];
                    case 20:
                        if (pointToIncrement === "40-adv") {
                            return [2 /*return*/, { score: "40-40" }];
                        }
                        else {
                            throw new Error("Game already finished!");
                        }
                        _a.label = 21;
                    case 21: return [3 /*break*/, 46];
                    case 22:
                        if (!(winner === 2)) return [3 /*break*/, 45];
                        if (!(pointToIncrement === "15-0")) return [3 /*break*/, 23];
                        return [2 /*return*/, { score: "15-15" }];
                    case 23:
                        if (!(pointToIncrement === "30-0")) return [3 /*break*/, 24];
                        return [2 /*return*/, { score: "30-15" }];
                    case 24:
                        if (!(pointToIncrement === "40-0")) return [3 /*break*/, 25];
                        return [2 /*return*/, { score: "40-15" }];
                    case 25:
                        if (!(pointToIncrement === "0-15")) return [3 /*break*/, 26];
                        return [2 /*return*/, { score: "0-30" }];
                    case 26:
                        if (!(pointToIncrement === "0-30")) return [3 /*break*/, 27];
                        return [2 /*return*/, { score: "0-40" }];
                    case 27:
                        if (!(pointToIncrement === "0-40")) return [3 /*break*/, 29];
                        return [4 /*yield*/, gameController_1.default.finishGame(2, gameId, setId, matchId)];
                    case 28: return [2 /*return*/, _a.sent()];
                    case 29:
                        if (!(pointToIncrement === "15-15")) return [3 /*break*/, 30];
                        return [2 /*return*/, { score: "15-30" }];
                    case 30:
                        if (!(pointToIncrement === "30-15")) return [3 /*break*/, 31];
                        return [2 /*return*/, { score: "30-30" }];
                    case 31:
                        if (!(pointToIncrement === "30-30")) return [3 /*break*/, 32];
                        return [2 /*return*/, { score: "30-40" }];
                    case 32:
                        if (!(pointToIncrement === "40-15")) return [3 /*break*/, 33];
                        return [2 /*return*/, { score: "40-30" }];
                    case 33:
                        if (!(pointToIncrement === "15-30")) return [3 /*break*/, 34];
                        return [2 /*return*/, { score: "15-40" }];
                    case 34:
                        if (!(pointToIncrement === "15-40")) return [3 /*break*/, 36];
                        return [4 /*yield*/, gameController_1.default.finishGame(2, gameId, setId, matchId)];
                    case 35: return [2 /*return*/, _a.sent()];
                    case 36:
                        if (!(pointToIncrement === "30-40")) return [3 /*break*/, 38];
                        return [4 /*yield*/, gameController_1.default.finishGame(2, gameId, setId, matchId)];
                    case 37: return [2 /*return*/, _a.sent()];
                    case 38:
                        if (!(pointToIncrement === "40-30")) return [3 /*break*/, 39];
                        return [2 /*return*/, { score: "40-40" }];
                    case 39:
                        if (!(pointToIncrement === "40-40")) return [3 /*break*/, 40];
                        return [2 /*return*/, { score: "40-adv" }];
                    case 40:
                        if (!(pointToIncrement === "adv-40")) return [3 /*break*/, 41];
                        return [2 /*return*/, { score: "40-40" }];
                    case 41:
                        if (!(pointToIncrement === "40-adv")) return [3 /*break*/, 43];
                        return [4 /*yield*/, gameController_1.default.finishGame(2, gameId, setId, matchId)];
                    case 42: return [2 /*return*/, _a.sent()];
                    case 43: throw new Error("Game already finished!");
                    case 44: return [3 /*break*/, 46];
                    case 45: throw new Error("Something went completely wrong with the scoring");
                    case 46: return [2 /*return*/];
                }
            });
        }); };
    }
    return scoreController;
}());
exports.default = new scoreController();
