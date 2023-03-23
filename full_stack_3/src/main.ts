import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ControllerDatabase} from "./controllers/ControllerDatabase";


const main = async () => {
    try {
        const app: Application = express();
        const mult = multer();
        app.use(express.json());
        app.use(express.urlencoded({extended: true})); // get data from HTML forms
        app.use(mult.array("data"));

        await ControllerDatabase.instance.connect(); // connect
        let session = await ControllerDatabase.instance.loginOrm(
            "test@gmail.com",
            "1234567890"
        )
        let habit = await ControllerDatabase.instance.get_habits(
            session
        )

        app.post('/login', async (req, res) => {
            let response = {
                session_token: "",
                success: true
            };
            let request = req.body();
            let session = await ControllerDatabase.instance.login(
                request.email,
                request.pass
            )
            // TODO logic via controller
            res.json(response);
        });

        app.post('/get_habits', (req, res) => {
            let request = req.body;
            // seit ieksa bus request.session_token (nevajag user_id, mes pec session_token jau visu zinam)
            let response = {
                success: true
            };
            // TODO logic via controller
            res.json(response);
        });

        // TODO

        app.listen(
            8000,
            () => {
                // http://127.0.0.1:8000
                console.log('Server started http://localhost:8000');
            }
        )
    }
    catch (e) {
        console.log(e);
    }
}
main();

