import {Body, Post, Get, Route, FormField, Query} from "tsoa";
import {ControllerDatabase} from "../ControllerDatabase";
import {DbHabit} from "../models/db/DbHabit";
import {TodosListRequest} from "../models/messages/TodosListRequest";
import {TodosNotification} from "../models/messages/TodosNotification";
import {TodosAddDelRequest} from "../models/messages/TodosAddDelRequest";
import {TodosUpdateRequest} from "../models/messages/TodosUpdateRequest";

@Route("todos")
export class ControllerTodos {


    /**
     * Habits list
     * @param request
     */
    @Post("list")
    public async list(@Body() request: TodosListRequest): Promise<DbHabit[] | TodosNotification> {
        let contDB: ControllerDatabase = new ControllerDatabase();
        await contDB.connect();
        let response: DbHabit[] | TodosNotification;
        response = await contDB.listHabits(request);
        await contDB.close();
        return response;

    }

    /**
     * Add habit
     * @param request
     */
    @Post("add")
    public async add(@Body() request: TodosAddDelRequest): Promise<TodosNotification> {
        let contDB: ControllerDatabase = new ControllerDatabase();
        await contDB.connect();
        let response: TodosNotification;
        response = await contDB.addHabit(request);
        await contDB.close();
        return response;
    }

    /**
     * Delete habit
     * @param request
     */
    @Post("delete")
    public async delete(@Body() request: TodosAddDelRequest): Promise<TodosNotification> {
        let contDB: ControllerDatabase = new ControllerDatabase();
        await contDB.connect();
        let response: TodosNotification;
        response = await contDB.deleteHabit(request);
        await contDB.close();
        return response;
    }

    /**
     * Update habit
     * @param request
     */
    @Post("update")
    public async update(@Body() request: TodosUpdateRequest): Promise<TodosNotification> {
        let contDB: ControllerDatabase = new ControllerDatabase();
        await contDB.connect();
        let response: TodosNotification;
        response = await contDB.updateHabit(request);
        await contDB.close();
        return response;
    }
}
