import {DbHabit} from "./DbHabit";

export interface DbHabitRecord
{
    habit_record_ud: number;
    habit_id: number;
    created: Date;

    habit?: DbHabit;
}