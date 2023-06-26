import {ControllerMovableElement} from "./ControllerMovableElement";
import {Rocket} from "../models/Rocket";
import {EnumElementType} from "../enums/EnumElementType";
import {ControllerGame} from "./ControllerGame";
import {ControllerRocket} from "./ControllerRocket";

export class ControllerAlien extends ControllerMovableElement {
    touch_border() {
        let touched = false;
        if (this.model.position.x >= 8.85 || this.model.position.x <= 0) {
            touched = true;
        }
        return touched;
    }

    fire_rocket() {
        let rocket: Rocket = {
            position: {
                x: this.model.position.x,
                y: this.model.position.y,
            },
            is_friendly: false,
            direction: {
                x: 0,
                y: 1,
            },
            speed: 2,
            type: EnumElementType.rocket,

        }
        ControllerGame.instance.elements.push(new ControllerRocket(rocket));
    }
}
