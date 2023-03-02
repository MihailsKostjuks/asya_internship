"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var multer = require("multer");
var app = express();
var mult = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // get data from HTML forms
app.use(mult.array("data"));
app.post('/calculate_stats', function (req, res) {
    var response = {
        success: true
    };
    res.json(response);
});
app.listen(8000, function () {
    // http://127.0.0.1:8000
    console.log('Server started http://localhost:8000');
});
//# sourceMappingURL=main.js.map