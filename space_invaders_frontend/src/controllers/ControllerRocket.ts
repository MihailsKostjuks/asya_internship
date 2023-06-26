
import {ControllerMovableElement} from "./ControllerMovableElement";
import {Rocket} from "../models/Rocket";

export class ControllerRocket extends ControllerMovableElement{
    model: Rocket;
    constructor(model:Rocket) {
        super(model);
        this.model = model;
    }

    update(delta_time: number) {
        super.update(delta_time);
        if (this.model.position.y <= 0 || this.model.position.y >= 18.85) {
            this.remove();
        }
    }
}
