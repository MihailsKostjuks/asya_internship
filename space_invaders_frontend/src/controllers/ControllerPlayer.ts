import {ControllerMovableElement} from "./ControllerMovableElement";
import {ControllerGame} from "./ControllerGame";
import {Rocket} from "../models/Rocket";
import {EnumElementType} from "../enums/EnumElementType";
import {ControllerRocket} from "./ControllerRocket";

export class ControllerPlayer extends ControllerMovableElement{

    cooldown = 0;

    fire_rocket() {

        if (this.cooldown === 0) {
            let rocket: Rocket = {
                position: {
                    x: this.model.position.x,
                    y: this.model.position.y,
                },
                is_friendly: true,
                direction: {
                    x: 0,
                    y: -1,
                },
                speed: 3,
                type: EnumElementType.rocket,

            }
            ControllerGame.instance.elements.push(new ControllerRocket(rocket));
            this.cooldown = 1;
        }
    }

    update(delta_time: number) {
        super.update(delta_time);
        this.cooldown -= delta_time;
        if (this.cooldown <= 0) {
            this.cooldown = 0;
        }
    }
}
