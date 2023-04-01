import { DataSource } from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {OrmHabit} from "../models/orm/OrmHabit";
import {DbHabit} from "../models/db/DbHabit";

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

    public async get_habitsOrm(
        session_token: string
    ): Promise<OrmHabit[]> {
        let habits: OrmHabit[] = null;
        let session: OrmSession;

        session = await this.dataSource.manager.findOne(OrmSession, {  // finds appropriate session
            where: {token: session_token}
        });

        habits = await this.dataSource.manager.find(OrmHabit, { // finds all the habits with the same user_id as the session
            where: {user_id: session.user_id}
        })

        return habits;
    }

    //TODO
    public async loginSQL(
        email: string,
        pass: string
    ): Promise<DbSession> {
        let session: DbSession = null; // vajag kko return
        let sha1Pass = sha1(pass);

        // query user with sent email + password
        let user_table = await this.dataSource.query(
            "SELECT * FROM users WHERE email = ? AND pass = ? AND is_deleted = 0",
            [email, pass] // params massivs: ko ielikt --> ?
            // ar sha1Pass nestrada, nezinu kapec =(
        )

        if (user_table.length > 0) {  // if user exists
            let user: DbUser = { // lai iegutu user_id prieks sessijai
                user_id: user_table[0].user_id,
                email: user_table[0].email,
                pass: user_table[0].pass,
                created: user_table[0].created,
                is_deleted: user_table[0].is_deleted
            }

            let sessionToken: string = uuidv4();
            await this.dataSource.query(
                "INSERT INTO sessions (user_id, token, is_valid) VALUES (?, ?, 1)", // query
                [user.user_id, sessionToken] // params
            )
            // let session_table = await this.dataSource.query(
            //     "SELECT last_insert_rowid() as session_id from sessions"  // takes last primary key and stores in session_id
            // );

            let session_table: any[] = await this.dataSource.query(  // array of queries
                "SELECT * FROM sessions JOIN users u on u.user_id = sessions.user_id WHERE sessions.token = ? AND sessions.is_valid = 1",
                [sessionToken]
            );

            session = {  // something wrong here and 134 line
                session_id: session_table[0].session_id,
                token: session_table[0].token,
                user_id: session_table[0].user_id,
                is_valid: session_table[0].is_valid,
                created: new Date(session_table[0].created),
                user: user
            }
            console.log("successful login");

        } else {
            console.log("wrong login/password");
        }
        return session;
    }

    public async get_habitsSQL(
        session: DbSession  // as parameter session object instead of session_token as I used for ORM. idk what's better
    ): Promise<DbHabit[]> {
        let habits: DbHabit[] = null;

        habits = await this.dataSource.query(
            "SELECT * FROM habits WHERE user_id = ?",
            [session.user_id]
        )
        console.log(session.user_id);
        console.log(habits);

        return habits;
    }
}