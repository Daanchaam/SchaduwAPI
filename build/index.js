"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
require("dotenv").config();
// Middleware
var auth_1 = __importDefault(require("./middleware/auth"));
var role_1 = __importDefault(require("./middleware/role"));
// Express setup
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = socket_io_1.default(server);
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/public")));
app.use(express_1.default.json());
app.use(cors_1.default());
// The whole socket.io business
io.on("connection", function (socket) {
    console.log("Client connected.");
    socket.emit("change color", "hoi");
    // Disconnect listener
    socket.on("disconnect", function () {
        console.log("Client disconnected.");
    });
});
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () { return console.log("Server is running on port: " + PORT); });
// Mongoose setup
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}, function (error) {
    if (error)
        throw error;
    console.log("MongoDB connection established");
});
// Route setup
app.use("/api/user", require("./routes/userRouter"));
app.use("/api/match", auth_1.default, role_1.default("admin", "referee"), require("./routes/matchRouter"));
