import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn} from "typeorm"
import {OrmUser} from "./OrmUser";


@Entity({name: "habits"})
export class OrmHabit {
    @PrimaryColumn()
    habit_id: number;

    @Column()
    user_id: number;

    @Column()
    label: string;

    @Column()
    is_deleted: boolean;

    @Column()
    created: Date;

    @OneToOne(type => OrmUser)
    @JoinColumn({name: "user_id"})
    user?: OrmUser;
}
