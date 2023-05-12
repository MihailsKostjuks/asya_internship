import {Application} from "express";
import express from "express";
import moment from "moment";

import cluster from "cluster";
import os from "os";
import nodemailer from "nodemailer";
import fs from "fs";
import * as _ from "lodash";
import {RegisterRoutes} from "./routers/routes";
import swaggerUi from "swagger-ui-express";


// All APIs that need to be included must be imported in app.ts
import {ControllerUsers} from "./controllers/ControllerUsers";
import {ControllerTodos} from "./controllers/ControllerTodos";
import {ControllerDatabase} from "./ControllerDatabase";


const PORT = 8000;
const app: Application = express();

app.use(express.json());
app.use(express.static("public")); // from this directory you can load files directly

RegisterRoutes(app);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    }),
);

app.listen(PORT, () => {
    console.log('Server is live. Go to http://localhost:8000/docs/');
    ControllerDatabase.instance.connect().then(
        r => console.log('Database is connected')
    );
})
