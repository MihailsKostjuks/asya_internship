import {TodosAddDelRequest} from "./TodosAddDelRequest";

export interface TodosUpdateRequest extends TodosAddDelRequest {
    newHabitLabel: string
}