import {TodosListRequest} from "./TodosListRequest";

export interface TodosAddDelRequest extends TodosListRequest {
    habitLabel: string
}