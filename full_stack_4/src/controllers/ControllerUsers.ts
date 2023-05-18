import {Body, Get, Post, Query, Route} from "tsoa";
import {UserLoginRequest} from "../models/messages/UserLoginRequest";
import {UserLoginResponse} from "../models/messages/UserLoginResponse";
import {ControllerDatabase} from "../ControllerDatabase";
import {UserRegisterRequest} from "../models/messages/UserRegisterRequest";
import {UserRegisterResponse} from "../models/messages/UserRegisterResponse";

@Route("user")
export class ControllerUsers {

    // @FormField if using file upload otherwise @Query()

    /**
     * Here you can login by entering your email & password. Device type is optional
     * @param request UserLoginRequest
     */
    @Post("login")
    public async login(@Body() request: UserLoginRequest): Promise<UserLoginResponse> {
        let contDB: ControllerDatabase = new ControllerDatabase();
        await contDB.connect();
        let response: UserLoginResponse = {
            sessionToken: "",
            is_success: false
        }
        let sessionToken: string = await contDB.login(
            request.email,
            request.password
        );
        if (sessionToken) {  // not null
            response = {
                sessionToken: sessionToken,
                is_success: true
            }
        }
        await contDB.close();
        return response;
    }

    /**
     * Here you can register by entering your email & password twice. Device type is optional
     * @param request UserLoginRequest
     */
    @Post("register")
    public async register(@Body() request: UserRegisterRequest): Promise<UserRegisterResponse> {
        // Initially I did not want to stay with "The passwords you entered do not match."
        // message field as default (because its too specific, but in this case is okay)
        let contDB: ControllerDatabase = new ControllerDatabase();
        await contDB.connect();

        let response: UserRegisterResponse = { // for further updates (now not needed)
            message: 'unknown error',
            is_success: false
        }
        if (request.password === request.reEnterPassword) {
            response = await contDB.register(
                request.email,
                request.password
            )
        } else {
            response = {
                message: "The passwords you entered do not match.",
                is_success: false
            }
        }
        await contDB.close();
        return response;
    }

    @Get("confirmation")
    public async confirmation(@Query() uuid: string): Promise<UserRegisterResponse>{
        return {
            message: 'Thanks for registration!',
            is_success: true
        };
    }
}
