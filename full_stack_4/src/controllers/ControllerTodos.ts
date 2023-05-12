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
        let response: DbHabit[] | TodosNotification;
        response = await ControllerDatabase.instance.listHabits(request);
        return response;

    }

    /**
     * Add habit
     * @param request
     */
    @Post("add")
    public async add(@Body() request: TodosAddDelRequest): Promise<TodosNotification> {
        let response: TodosNotification;
        response = await ControllerDatabase.instance.addHabit(request);
        return response;
    }

    /**
     * Delete habit
     * @param request
     */
    @Post("delete")
    public async delete(@Body() request: TodosAddDelRequest): Promise<TodosNotification> {
        let response: TodosNotification;
        response = await ControllerDatabase.instance.deleteHabit(request);
        return response;
    }

    /**
     * Update habit
     * @param request
     */
    @Post("update")
    public async update(@Body() request: TodosUpdateRequest): Promise<TodosNotification> {
        let response: TodosNotification;
        response = await ControllerDatabase.instance.updateHabit(request);
        return response;
    }
}
