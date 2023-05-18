import * as sha1 from "js-sha1";
import {v4 as uuidv4} from 'uuid';
import { DataSource } from "typeorm";

import {DbUser} from "./models/db/DbUser";
import {DbSession} from "./models/db/DbSession";
import {DbHabit} from "./models/db/DbHabit";
import {UserRegisterResponse} from "./models/messages/UserRegisterResponse";
import {TodosListRequest} from "./models/messages/TodosListRequest";
import {TodosVerification} from "./models/messages/TodosVerification";
import {TodosNotification} from "./models/messages/TodosNotification";
import {TodosAddDelRequest} from "./models/messages/TodosAddDelRequest";
import {TodosUpdateRequest} from "./models/messages/TodosUpdateRequest";
import fs from "fs";
import nodemailer from "nodemailer";


export class ControllerDatabase {

    private dataSource: DataSource;
    constructor() {
        // init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite", // sqlite glaba visu viena failā
            logging: false,
            synchronize: false
        });
    }

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }
    public async close(): Promise<void> {
        await this.dataSource.destroy();
    }

    public async login(
        email: string,
        pass: string
    ): Promise<DbSession['token']> { // returns session token

        let sessionToken: DbSession['token'] = null; // default value
        // let sha1Pass = sha1(pass);

        // query user with sent email + password
        let user_table = await this.dataSource.query(
            "SELECT * FROM users WHERE email = ? AND pass = ? AND is_deleted = 0",
            [email, pass] // params massivs: ko ielikt --> ?
            // ar sha1Pass nestrada, nezinu kapec =(
        )

        if (user_table.length > 0) {  // if user exists
            let userTable = user_table[0];
            let user: DbUser = { // lai iegutu user_id prieks sessijai
                user_id: userTable.user_id,
                email: userTable.email,
                pass: userTable.pass,
                created: userTable.created,
                is_deleted: userTable.is_deleted
            }

            sessionToken = uuidv4();
            await this.dataSource.query(
                "INSERT INTO sessions (user_id, token, is_valid) VALUES (?, ?, 1)", // query
                [user.user_id, sessionToken]
            )
            return sessionToken;
        }
        return sessionToken;
    }

    public async register(
        email: string,
        pass: string
    ): Promise<UserRegisterResponse> { // returns session token

        let response: UserRegisterResponse = {
            message: 'Account with entered email already exists',
            is_success: false
        }; // default value

        let user_table = await this.dataSource.query(
            "SELECT * FROM users WHERE email = ? AND is_deleted = 0",
            [email]
        )
        if (user_table.length === 0) { // if no user is registered with these credentials
            await this.dataSource.query(
                "INSERT INTO users (email, pass) VALUES (?, ?)",
                [email, pass] // named params don't work and I don't know why.
                // as params dataSource expects any[], not an object...
                // [obj] inserts empty data (see users 2nd record)
            )
            response = {
                message: 'Thanks for registration!',
                is_success: true
            }
            await this.verifyEmail(
                email
            );
        }
        return response;
    }

    public async verifyEmail (
        email: string
    ): Promise<void> {
        let uuid: string = uuidv4();
        let url: string = `http://localhost:8000/docs/user/confirmation/${uuid}`;
        let htmlTemplate: string = fs.readFileSync(
            'src/verificationTemplate.html',
            {encoding: 'utf-8'}
        );
        htmlTemplate = htmlTemplate.replace(/{registration_link}/g, url);
        const transporter = nodemailer.createTransport({  // uses SMTP
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'dummymailsmtp123@gmail.com',
                pass: 'grksochplmxuquox'
            }
        });
        let result = await transporter.sendMail({
            from: 'dummymailsmtp123@gmail.com',
            to: [email],
            subject: 'Confirm your registration',
            // text: `Follow this link to verify your email: ${url}` ,
            html: htmlTemplate
            // either plain text or html
            // (services restrict HTML & CSS usage in order to prevent scam buttons etc)
        });
    }

    public async tokenIsValid(
        sessionToken: string
    ): Promise<TodosVerification> {
        let sessionRows: DbSession[] = [];
        let response: TodosVerification = {
            is_success: false,
            user_id: null
        }
        sessionRows = await this.dataSource.query(
            "SELECT * FROM sessions WHERE token = ? LIMIT 1",
            [sessionToken]
        );

        if (sessionRows.length > 0) {
            let sessionRow: DbSession = sessionRows[0];
            response = {
                is_success: true,
                user_id: sessionRow.user_id
            }
        }
        return response;
    }

    public async listHabits(  // return habits using given sessionToken
        request: TodosListRequest
    ): Promise<DbHabit[] | TodosNotification> {
        let habits: DbHabit[] = null;
        let responseMessage: TodosNotification = {
            message: 'invalid session token',
            is_success: false
        }

        let tokenCheck: TodosVerification = await this.tokenIsValid(
            request.sessionToken
        )
        if (tokenCheck.is_success === false && !tokenCheck.user_id) {
            return responseMessage;
        }
        habits = await this.dataSource.query(  // select habits using that session
            "SELECT * FROM habits WHERE user_id = ?",
            [tokenCheck.user_id]
        )

        return habits;  // code is not optimal (many repeated lines) but I tried to send ./login_sql response
        // to ./get_habits_sql manually. (I found no ways connect 2 app.post so they communicate automatically
    }

    public async addHabit(
        request: TodosAddDelRequest
    ): Promise<TodosNotification> {
        let responseMessage: TodosNotification = {
            message: 'invalid session token',
            is_success: false
        };
        let tokenCheck: TodosVerification = await this.tokenIsValid(
            request.sessionToken
        );
        if (tokenCheck.is_success === false || !tokenCheck.user_id) {
            return responseMessage;
        }
        await this.dataSource.query(  // do I need to check whether the query was successful or not?
            "INSERT INTO habits (label, user_id) VALUES (?, ?)",
            [request.habitLabel, tokenCheck.user_id]
        );
        responseMessage = {
            message: `Habit ${request.habitLabel} was added.`,
            is_success: true
        }
        return responseMessage;
        }

    public async deleteHabit(
        request: TodosAddDelRequest
    ): Promise<TodosNotification> {
        let responseMessage: TodosNotification = {
            message: 'invalid session token',
            is_success: false
        };
        let tokenCheck: TodosVerification = await this.tokenIsValid(
            request.sessionToken
        );
        if (tokenCheck.is_success === false && !tokenCheck.user_id) {
            return responseMessage;
        }
        let habitToBeDeleted: DbHabit[] = await this.dataSource.query(
            "SELECT * FROM habits WHERE label = ? AND user_id = ? LIMIT 1",
            [request.habitLabel, tokenCheck.user_id]
        );
        if (habitToBeDeleted[0]) {
            await this.dataSource.query(
                "DELETE FROM habits WHERE label = ? AND user_id = ?",
                [request.habitLabel, tokenCheck.user_id]
            );
            responseMessage = {
                message: `Habit ${request.habitLabel} was deleted.`,
                is_success: true
            }
            return responseMessage;
        } else {
            responseMessage = {
                message: 'You have no such a habit.',
                is_success: false
            }
            return responseMessage;
        }
    }

    public async updateHabit(
        request: TodosUpdateRequest
    ): Promise<TodosNotification> {
        let responseMessage: TodosNotification = {
            message: 'invalid session token',
            is_success: false
        };
        let tokenCheck: TodosVerification = await this.tokenIsValid(
            request.sessionToken
        );
        if (tokenCheck.is_success === false && !tokenCheck.user_id) {
            return responseMessage;
        }
        let result = await this.dataSource.query(
            "UPDATE habits SET label = ? WHERE label = ?",
            [request.newHabitLabel, request.habitLabel],
        )
        if (result.affected == 0) {
            responseMessage = {
                message: 'You have no such a habit',
                is_success: false
            }
        } else {
            responseMessage = {
                message: `${request.habitLabel} was updated to ${request.newHabitLabel}`,
                is_success: true
            }
        }
        return responseMessage;
    }
}