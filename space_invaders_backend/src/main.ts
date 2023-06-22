import express from "express";
import cors from "cors";
import * as csv_writer from "csv-writer";
import * as csvtojson from "csvtojson";
import Database from "better-sqlite3";


const PORT = 8000;
const app = express();
let session_start = undefined;

// const CSVFilePath = 'csvs/results.csv';
//
// const csv = csv_writer.createObjectCsvWriter({
//     path: CSVFilePath,
//     header: [
//         {id: 'name', title: 'name'},
//         {id: 'score', title: 'score'},
//     ]
// })
//
// async function main() {
//     let records = [
//         {name: 'Misha', score: 100},
//         {name: 'Misha2', score: 1001}
//     ]
//     await csv.writeRecords(records);
//     let read_records = await csvtojson().fromFile(CSVFilePath);
//     console.log(records, read_records);
// }
//
// main();

app.use(cors());
app.use(express.json());

app.post('/start_session', (req, res) => {
    let response = {
        is_success: false
    }
    try {
        if (req.body.is_session_started) {
            session_start = new Date();
        }
        response.is_success = true
    } catch (e) {
        console.error(e);
    }
    res.send(response);
})

app.post('/end_session', (req, res) => {
    let response = {
        is_success: false
    }
    try {
        if (req.body.is_session_ended) {
            session_start = new Date();
        }
        response.is_success = true
    } catch (e) {
        console.error(e);
    }
    res.send(response);
})

app.post('/register_player', async (req, res) => {
    console.log(req.body);
    let response = {
        is_success: false,
        player_id: undefined,
        session_id: undefined
    };
    try {
        let request = req.body;
        const db = new Database('database.sqlite');
        let query_player = db.prepare(
            'INSERT INTO player (player_name, age) VALUES (@player_name, @age)'
        );

        let result_player = query_player.run({
            player_name: request.player_name,
            age: 20
        });

        let query_session = db.prepare(
            'INSERT INTO sessions (player_id) VALUES (@player_id)'
        );

        let result_session = query_session.run({
            player_id: result_player.lastInsertRowid
        });

        response.is_success = true;
        response.player_id = result_player.lastInsertRowid;
        response.session_id = result_session.lastInsertRowid;

    } catch (e) {
        console.error(e);
    }

    res.send(response);
})

app.post('/insert_scores', async (req, res) => {
    console.log(req.body);
    let response = {
        is_success: false,
        score_id: 0
    };
    try {
        let request = req.body;
        const db = new Database('database.sqlite');
        let query = db.prepare(
            'INSERT INTO scores (score, session_id) VALUES (@score, @session_id)'
        );

        let result = query.run({
            score: request.score,
            session_id: request.session_id
        });

        response.is_success = true;
        response.score_id = result.lastInsertRowid as number;

    } catch (e) {
        console.error(e);
    }

    res.send(response);
})

app.get('/get_scores', async (req, res) => {

    let response = {
        is_success: false,
        scores: []
    };
    try {
        let request = req.body;
        const db = new Database('database.sqlite');
        let query = db.prepare(
            'SELECT score FROM scores INNER JOIN sessions ON scores.session_id = sessions.session_id INNER JOIN player ON sessions.player_id = player.player_id  WHERE player.player_id = @player_id ORDER BY score DESC'
        );

        let result = query.all({
            player_id: request.player_id
        });

        response.is_success = true;
        response.scores = result;

    } catch (e) {
        console.error(e);
    }

    res.send(response);
})

app.listen(PORT, async () => {
    console.log(`Server is live on ${PORT} port.`);
})

