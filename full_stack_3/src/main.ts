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
        // let session = await ControllerDatabase.instance.loginOrm(
        //     "test@gmail.com",
        //     "1234567890"
        // )
        // let habit = await ControllerDatabase.instance.get_habits(
        //     session
        // )

        app.post('/login', async (req, res) => {
            let request = req.body;
            let session = await ControllerDatabase.instance.loginOrm(
                request.email,
                request.pass
            )
            if (session !== null) {
                let session_token: string = session.token; // stradam ar tokenu
                let responseParam: string = encodeURIComponent(session_token);
                res.redirect(`/get_habits?response=${responseParam}`);
            } else {
                res.send('Invalid login and/or password.'); // converts to json string
            }


        });

        app.get('/get_habits', async (req, res) => {
            let sessionTokenSentFromLogin = req.query.response as string;
            let request: string = decodeURIComponent(sessionTokenSentFromLogin);
            let habits = await ControllerDatabase.instance.get_habitsOrm(request);

            if (habits === null) {
                res.send("You have currently no habits posted here. Now it's the best time to start!");
            } else {
                res.send(habits);
            }
        });

        app.post('/login_sql', async (req, res) => {
            let request = req.body;
            let session = await ControllerDatabase.instance.loginSQL(
                request.email,
                request.pass
            )
            if (session === null) {
                res.send('Invalid login and/or password.');
            } else {
                let responseParam = encodeURIComponent(JSON.stringify(session));
                res.redirect(`/get_habits_sql?response=${responseParam}`);
            }
        });

        app.get('/get_habits_sql', async (req, res) => {
            let sessionSentFromLogin = req.query.response as string;
            let request = JSON.parse(decodeURIComponent(sessionSentFromLogin));
            let habits = await ControllerDatabase.instance.get_habitsSQL(request);

            if (habits === null) {
                res.send("You have currently no habits posted here. Now it's the best time to start!");
            } else {
                res.send(habits);
            }
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

