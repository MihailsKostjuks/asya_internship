import {DbUser} from "./DbUser";

export interface DbSession
{
    user_id: number;
    session_id: number;
    token: string;
    is_valid: boolean;
    created: Date;

    user?: DbUser;
}