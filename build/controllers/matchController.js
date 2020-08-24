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
var setController_1 = __importDefault(require("./setController"));
var matchController = /** @class */ (function () {
    function matchController() {
        var _this = this;
        /**
         * Start match by creating the teams and the first game and set without points
         */
        this.startMatch = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, team1, team2, serving, superTiebreak, newMatch, savedMatch, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, team1 = _a.team1, team2 = _a.team2, serving = _a.serving, superTiebreak = _a.superTiebreak;
                        // Validation
                        if (!team1 || !team2 || !serving) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Not all fields have been filled in",
                                })];
                        }
                        if (team1.length !== team2.length) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "This match seems unfair, please select an equal number of players on both sides",
                                })];
                        }
                        if (!team1.some(function (e) { return e.name === serving; }) &&
                            !team2.some(function (e) { return e.name === serving; })) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Is the serving person not joining the match?",
                                })];
                        }
                        newMatch = new matchModel_1.default({
                            team1: team1,
                            team2: team2,
                            date: {
                                startDate: Date.now(),
                            },
                            superTiebreak: superTiebreak,
                        });
                        return [4 /*yield*/, newMatch.save()];
                    case 1:
                        savedMatch = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, setController_1.default.createNewSet(savedMatch._id, serving)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        throw new Error("Set could not be added to the match!" + error_1.message);
                    case 5:
                        res.json({
                            message: "Match started!",
                            matchId: savedMatch._id,
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Adds a set to a match given both ID's
         * @param {string} setId The ID of the set that has to be added to the match
         * @param {string} matchId the ID of the match that the set has to be added to
         */
        this.addSetToMatch = function (setId, matchId) { return __awaiter(_this, void 0, void 0, function () {
            var currentMatch, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        currentMatch = _a.sent();
                        if (!currentMatch) {
                            throw new Error("Match could not be found");
                        }
                        if (currentMatch.sets.length > 2) {
                            throw new Error("Are we playing a 5-set match?");
                        }
                        return [4 /*yield*/, matchModel_1.default.findByIdAndUpdate(matchId, {
                                $push: { sets: { id: setId } },
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Something went wrong adding the set to the match" + error_2.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.updateMatchScore = function (setWinner, matchId) { return __awaiter(_this, void 0, void 0, function () {
            var currentMatch, currentScore, newScore, matchFinished, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, matchModel_1.default.findById(matchId)];
                    case 1:
                        currentMatch = _a.sent();
                        if (!currentMatch) {
                            throw new Error("Match to update score in has not been found");
                        }
                        currentScore = currentMatch.score;
                        newScore = void 0;
                        matchFinished = false;
                        if (setWinner === 1) {
                            newScore = {
                                team1: currentScore.team1 + 1,
                                team2: currentScore.team2,
                            };
                        }
                        else {
                            newScore = {
                                team1: currentScore.team1,
                                team2: currentScore.team2 + 1,
                            };
                        }
                        return [4 /*yield*/, matchModel_1.default.findByIdAndUpdate(matchId, { score: newScore })];
                    case 2:
                        _a.sent();
                        if (newScore.team1 === 2 || newScore.team2 === 2) {
                            this.finishMatch(matchId, newScore);
                            matchFinished = true;
                        }
                        return [2 /*return*/, {
                                matchFinished: matchFinished,
                                score: newScore,
                            }];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Something went wrong updating the match score" + error_3.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.finishMatch = function (matchId, finalScore) { return __awaiter(_this, void 0, void 0, function () {
            var winner, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        winner = finalScore.team1 === 2 ? "team 1" : "team 2";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, matchModel_1.default.findByIdAndUpdate(matchId, {
                                winner: winner,
                                "date.endDate": Date.now(),
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Something went wrong trying to finish the match");
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return matchController;
}());
exports.default = new matchController();
