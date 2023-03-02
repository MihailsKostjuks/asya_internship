import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ApiRequest} from "./interfaces/APIRequest";
import {ApiResponse} from "./interfaces/APIResponse";

const app: Application = express();
//const mult = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true})); // get data from HTML forms
//app.use(mult.array("data"));

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './files');
    },
    filename: (req, file, callback) => {
        callback(null, 'iris.json');
        // callback(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: fileStorageEngine});

app.post('/upload', upload.single('iris'), (req, res) => { // for uploading and saving request data (iris dataset)
    console.log('Successfully sent. Redirecting to /calculate_stats ...');
    res.redirect('/calculate_stats');
})

// app.post('/upload/:species', upload.single('iris'), (req, res) => { // for uploading and saving request data (iris dataset)
//     // species = req.params.species;
//     let species = req.params.species;
//     fs.writeFileSync(
//         './files/species.txt',
//         species,
//         {encoding: 'utf-8'}
//     )
//     res.end();
//     console.log('Successfully sent. Redirecting to /calculate_stats ...');
// })

// app.post('/upload/:species', (req, res) => {
//     const species = req.params.species
//     console.log(typeof req);
//     let content = fs.readFileSync(req.body,{encoding: "utf-8"});
//     // fs.writeFileSync(
//     //     `./files/iris_${species}`,
//     //     req.body,
//     //     {encoding: "utf-8"}
//     //     )
//     // console.log('Successfully sent. Redirecting to /calculate_stats ...');
//     res.end();
//     //res.redirect('/calculate_stats');
// })

app.get('/calculate_stats', (req, res) => {
    let request = fs.readFileSync( // reads (saves) the content of dataset to the request variable
        './files/iris.json',
        {encoding: "utf-8"}
    )
    let request_json = JSON.parse(request); // string -> json

    let response: ApiResponse = {
        // toFixed() returns string -> parseFloat after rounding
        sepalLengthAvg: parseFloat((request_json.reduce((acc,cur) => acc + cur.sepalLength, 0)/request_json.length).toFixed(2)),
        sepalWidthAvg: parseFloat((request_json.reduce((acc,cur) => acc + cur.sepalWidth, 0)/request_json.length).toFixed(2)),
        petalLengthAvg: parseFloat((request_json.reduce((acc,cur) => acc + cur.petalLength, 0)/request_json.length).toFixed(2)),
        petalWidthAvg: parseFloat((request_json.reduce((acc,cur) => acc + cur.petalWidth, 0)/request_json.length).toFixed(2)),

        // The Math.min() function actually expects a series of numbers, but it doesn't know how to handle an actual array
        sepalLengthMin: Math.min(...request_json.map(iris => iris.sepalLength)), // so we use ... before an array
        sepalWidthMin: Math.min(...request_json.map(iris => iris.sepalWidth)),
        petalLengthMin: Math.min(...request_json.map(iris => iris.petalLength)),
        petalWidthMin: Math.min(...request_json.map(iris => iris.petalWidth)),

        sepalLengthMax: Math.max(...request_json.map(iris => iris.sepalLength)),
        sepalWidthMax: Math.max(...request_json.map(iris => iris.sepalWidth)),
        petalLengthMax: Math.max(...request_json.map(iris => iris.petalLength)),
        petalWidthMax: Math.max(...request_json.map(iris => iris.petalWidth)),

        isSuccess: true
    };

    let results_dir = './files'; // dir path
    let results_file = `${results_dir}/results.json`; // file path for results

    if (!fs.existsSync(results_dir)){ // checks whether dir exists
        fs.mkdirSync(results_dir);
    }
    if (!fs.existsSync(results_file)) { // checks whether one and only one results file exists
        fs.appendFileSync(
            results_file,
            JSON.stringify(response), // JS value -> json string (key: value -> "key": value)
            {encoding: "utf-8"}
        );
    }
    let content_file = fs.readFileSync( // variable that contains results' content
        results_file,
        {encoding: "utf-8"}
    )
    res.send(JSON.parse(content_file)); // looks like a structured json and not like a string

});

app.listen(
    8000,
    () => {
        // http://127.0.0.1:8000
        console.log('Server started http://localhost:8000');
    }
)
