import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ApiRequest} from "./interfaces/APIRequest";
import {ApiResponse} from "./interfaces/APIResponse";
import * as buffer from "buffer";
import { promises } from "fs";

const bodyParser = require('body-parser');


function calculateAverage (records, property): number {
    let total: number = records.reduce((acc, cur) => acc + cur[property], 0);
    let average: number = total / records.length;
    let averageRounded: string = average.toFixed(2);
    return parseFloat(averageRounded);
}

function calculateMinimum (records, property): number {
    let numbers: number[] = records.map(record => record[property]);
    return Math.min(...numbers);
}

function calculateMaximum (records, property): number {
    let numbers: number[] = records.map(record => record[property]);
    return Math.max(...numbers);
}

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true})); // get data from HTML forms
app.use(bodyParser.json());


const storageIrisDataset = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './files/requests');
    },
    filename: (req, file, callback) => {
        callback(null, 'iris.json');
    }
});
const upload = multer({ storage: storageIrisDataset});

const species: string[] = ['setosa', 'virginica', 'versicolor'];

app.post('/upload', upload.single('iris'), async (req, res) => {

    // KEY: description
    let reqBodyString: string;
    let reqBodyJSON : ApiRequest = {
        species: null
    };

    let filePath: string; // for write/read file
    let fileExists: boolean;
    let response: ApiResponse = { // for calculation

        sepalLengthAvg: 0,
        sepalWidthAvg: 0,
        petalLengthAvg: 0,
        petalWidthAvg: 0,

        sepalLengthMin: 0,
        sepalWidthMin: 0,
        petalLengthMin: 0,
        petalWidthMin: 0,

        sepalLengthMax: 0,
        sepalWidthMax: 0,
        petalLengthMax: 0,
        petalWidthMax: 0,

        isSuccess: false
    };
    let responseString: string;

    if (req.body.description) {  // checks if description field was given or not
        reqBodyString = req.body.description
        reqBodyJSON = JSON.parse(reqBodyString);
    }

    let rawIrisDataset: string = fs.readFileSync(
        './files/requests/iris.json',
        {encoding: "utf-8"}
    )

    let irisDataset = JSON.parse(rawIrisDataset); // string -> json

    try {
        // if description field was given:
        if (reqBodyJSON.species) { // if null then returns false, if was given in Postman then --> true
            if (species.includes(reqBodyJSON.species)) {
                filePath = `files/responses/calculated_dataset_${reqBodyJSON.species}.json`;
                fileExists = fs.existsSync(filePath);
                irisDataset = irisDataset.filter((irisRecord) => {
                    return irisRecord.species === reqBodyJSON.species;
                });
            } else {  // description was given but the species is invalid
                res.send("There's no such species found.");
            }
        }
        else {  // if description fields was not given at all
            filePath = `files/responses/calculated_dataset.json`;
            fileExists = fs.existsSync(filePath);
        }
        if (!fileExists) {
            response = {
                sepalLengthAvg: calculateAverage(irisDataset, 'sepalLength'),
                sepalWidthAvg: calculateAverage(irisDataset, 'sepalWidth'),
                petalLengthAvg: calculateAverage(irisDataset, 'petalLength'),
                petalWidthAvg: calculateAverage(irisDataset, 'petalWidth'),

                sepalLengthMin: calculateMinimum(irisDataset, 'sepalLength'),
                sepalWidthMin: calculateMinimum(irisDataset, 'sepalWidth'),
                petalLengthMin: calculateMinimum(irisDataset, 'petalLength'),
                petalWidthMin: calculateMinimum(irisDataset, 'petalWidth'),

                sepalLengthMax: calculateMaximum(irisDataset, 'sepalLength'),
                sepalWidthMax: calculateMaximum(irisDataset, 'sepalWidth'),
                petalLengthMax: calculateMaximum(irisDataset, 'petalLength'),
                petalWidthMax: calculateMaximum(irisDataset, 'petalWidth'),

                isSuccess: true
            };

            await promises.writeFile(  // fs needs a callback
                filePath,
                JSON.stringify(response) // pirms norakstisanas vajag json -> string
            )
        }

        responseString = await promises.readFile( // variable that contains results' content
            filePath, // promises -> no callback
            {encoding: "utf-8"}
        )
        let finalResponse: ApiResponse = JSON.parse(responseString);
        res.send(finalResponse); // looks like a structured json and not like a string
    }
    catch (error){
        console.log(error);  // vareju ari send isSuccess: false bet tad vajag visas avg min max darit ?(optional)

        res.redirect('/404');
    }
})

app.get('/404', (req, res) => {

    res.send('Something went wrong.')

})

app.listen(
    8000,
    () => {
        // http://127.0.0.1:8000
        console.log('Server started http://localhost:8000');
    }
)
