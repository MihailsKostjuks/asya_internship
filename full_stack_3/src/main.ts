import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ControllerDatabase} from "./controllers/ControllerDatabase";
import {RequestMessageLogin} from "./models/messages/RequestMessageLogin";
import {OrmSession} from "./models/orm/OrmSession";
import {ResponseMessageLogin} from "./models/messages/ResponseMessageLogin";
import {RequestMessageHabits} from "./models/messages/RequestMessageHabits";
import {OrmHabit} from "./models/orm/OrmHabit";
import {DbHabit} from "./models/db/DbHabit";


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
            let request: RequestMessageLogin = {
                email: req.body.email,
                pass: req.body.pass
            }; // question1: do I need to assign some default
            // values for REQUEST object (located above) firstly, only then reassign with req.body?
            // Question occurred because you said:
            // "jabut vienmer default vertibam, nevar but undefined (request & response)"

            let session: OrmSession = await ControllerDatabase.instance.loginOrm(
                request.email,
                request.pass
            )
            if (session !== null) {
                let requestHabits: RequestMessageHabits = {
                    sessionToken: session.token
                };
                let habits: OrmHabit[] = await orm_get_habits(requestHabits); // returns habits using the session token
                if (habits !== null){
                    res.send(habits)
                } else {
                    res.send("You have currently no habits posted here. Now it's the best time to start!");
                }
            } else {
                let response: ResponseMessageLogin = {
                    success: false,
                    error_message: 'Invalid login and/or password.'
                }
                res.send(response);
            }
        });

        // makes no sense (to replace 2 lines of code into 6)
        const orm_get_habits = async (req: RequestMessageHabits) =>  { // question2: res?
            // (which res argument to provide if I call this function?)
            let sessionTokenSentFromLogin = req.sessionToken;
            let habits: OrmHabit[] = await ControllerDatabase.instance.get_habitsOrm(sessionTokenSentFromLogin);
            // Local variable 'habits' is redundant ?why?
            return habits;
            // question3: no idea how to connect orm_get_habits with .post method ( so I coded them separately)
        }
        // if I set res as the second parameter, it does not work as res.send in express.js, it's an argument

        app.post('/get_habits', orm_get_habits); // ???????

        // (I still liked post -> get using params the most)
        // need some explanation how to connect 2 post, so they work automatically
        app.post('/login_sql', async (req, res) => {
            let session = await ControllerDatabase.instance.loginSQL(
                req.body.email,
                req.body.pass
            )
            if (session === null) {
                res.send('Invalid login and/or password.');
            } else {
                let requestHabits: RequestMessageHabits = {
                    sessionToken: session.token
                };

                // sends session token back, can be used further to get habits manually
                res.send(requestHabits); // probably bad naming, however it fits the interface's name
            }
        });

        app.post('/get_habits_sql', async (req, res) => {
            let requestSessionToken = req.body.sessionToken; // enter sessionToken into "key" field
            let habits: DbHabit[] = await ControllerDatabase.instance.get_habitsSQL(requestSessionToken);

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

