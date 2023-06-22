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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const csv_writer = require("csv-writer");
const csvtojson = require("csvtojson");
const PORT = 8000;
const app = express();
const CSVFilePath = 'csvs/results.csv';
const csv = csv_writer.createObjectCsvWriter({
    path: CSVFilePath,
    header: [
        { id: 'name', title: 'name' },
        { id: 'score', title: 'score' },
    ]
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let records = [
            { name: 'Misha', score: 100 },
            { name: 'Misha2', score: 1001 }
        ];
        yield csv.writeRecords(records);
        let read_records = yield csvtojson().fromFile(CSVFilePath);
        console.log(records, read_records);
    });
}
main();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Yuhuuuu');
});
app.post('/insert_scores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let response = {
        is_success: true
    };
    res.send(response);
}));
app.post('/get_scores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let response = {
        is_success: true
    };
    res.send(response);
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is live on ${PORT} port.`);
}));
//# sourceMappingURL=main.js.map