"use strict";
var hasRole = function () {
    var userRole = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        userRole[_i] = arguments[_i];
    }
    return function (req, res, next) {
        var user = req.user;
        if (user && userRole.includes(user.role)) {
            next();
        }
        else {
            res.status(403).json({ message: "You do not have the permission to perform this action, you only have roles " + user.role + " and you need " + userRole });
        }
    };
};
module.exports = hasRole;
