import { DataSource } from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {OrmHabit} from "../models/orm/OrmHabit";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite", // sqlite glaba visu viena failā
            logging: false,
            synchronize: false,
            entities: [
                OrmUser,
                OrmSession,
                OrmHabit
            ]
        })
    }

    public static get instance(): ControllerDatabase {
        if (!ControllerDatabase._instance) {
            ControllerDatabase._instance = new ControllerDatabase();
        }
        return ControllerDatabase._instance;
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async loginOrm(
        email: string,
        pass: string
    ): Promise<OrmSession> {
        let session: OrmSession = null;
        let sha1Pass = sha1(pass);
        // kope user no DB pec attiecigas email/pass lai pievienotu to sai sessijai (user_id + user)
        let user: OrmUser = await this.dataSource.manager.findOne(OrmUser, {
            where: {
                email: email,
                pass: pass
            }
        })
        if (user) { // ja DB ir tads user (objects nav tukss), tad saglaba sessiju un izvada "login successful"
            session = new OrmSession()
            session.user_id = user.user_id;
            session.token = uuidv4();
            session.is_valid = true;
            session.created = new Date();
            session.user = user;
            await this.dataSource.manager.save(session); // pievieno session databasei

            session = await this.dataSource.manager.findOne(OrmSession, {
                where: {
                    session_id: session.session_id
                },
                relations: {
                    user: true
                }
            });

            console.log("Successful login");
        }
        else {
            console.log("Login failed");
        }
        return session; // return OrmSession class instance

    }

    public async get_habits(
        session: OrmSession
    ): Promise<string[]> {
        // let habit: OrmHabit = null;
        let habits: OrmHabit[];
        let labels: string[] = []

        if (session.user_id) {
            let habits = await this.dataSource.manager.find(OrmHabit, {
                where: {
                    user_id: session.user_id
                }
            });

            habits.forEach(
                habit => {
                    labels.push(habit.label);
                }
            )
            console.log(labels); // vajag return nevis log bet tas prieks treninam
        }
        else {
            console.log("unexpected error");
        }

        return labels;
    }

    //TODO
    public async login(
        email: string,
        pass: string
    ): Promise<DbSession> {
        let session: DbSession = null; // vajag kko return
        let sha1Pass = sha1(pass);

        // named params
        let rows = await this.dataSource.query(
            "SELECT * FROM users WHERE email = ? AND pass = ? AND is_deleted = 0",
            [email, pass] // params massivs: ko ielikt --> ?
            // ar sha1Pass nestrada, nezinu kapec =(
        )

        if (rows.length > 0) {
            let user: DbUser = {
                user_id: rows[0].user_id,
                email: rows[0].email,
                pass: rows[0].pass,
                created: rows[0].created,
                is_deleted: rows[0].is_deleted
            }

            let sessionToken: string = uuidv4();
            await this.dataSource.query(
                "INSERT INTO sessions (user_id, token, is_valid) VALUES (?, ?, 1)", // query
                [user.user_id, sessionToken] // params
            )
            let rowLast = await this.dataSource.query(
                "SELECT last_insert_rowid() as session_id"
            );
            session = {
                session_id: rowLast[0].session_id,
                token: sessionToken,
                user_id: user.user_id,
                is_valid: true,
                created: new Date(),
                user: user
            }
            console.log("successful login");

        } else {
            console.log("wrong login/password");
        }
        return session;
    }
}