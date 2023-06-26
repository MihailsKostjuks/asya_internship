import {MovableElement} from "../models/MovableElement";
import {ControllerElement} from "./ControllerElement";

export class ControllerMovableElement extends ControllerElement{
    model: MovableElement;

    constructor(model: MovableElement) {
        super(model);
        this.model = model
    }

    update(delta_time: number) {
        super.update(delta_time);
        let pos_x = this.model.position.x;
        let pos_y = this.model.position.y;
        pos_x += this.model.direction.x * delta_time * this.model.speed;
        pos_y += this.model.direction.y * delta_time * this.model.speed;
        if (pos_x < 9) {
            this.model.position.x = pos_x;
        }
        if (pos_y < 19) {
            this.model.position.y = pos_y;
        }
    }

    left() {
        this.model.direction.x = -1;
        this.model.direction.y = 0;
    }

    right() {
        this.model.direction.x = 1;
        this.model.direction.y = 0;
    }

    up() {
        this.model.direction.x = 0;
        this.model.direction.y = -1;
    }

    down() {
        this.model.direction.x = 0;
        this.model.direction.y = 1;
    }

    stop() {
        this.model.direction.x = 0;
        this.model.direction.y = 0;
    }
}
