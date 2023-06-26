import {Element} from "../models/Element";
import {ControllerGame} from "./ControllerGame";
import _ from "lodash";

export class ControllerElement {
    model: Element;
    constructor(model: Element) {
        this.model = model;
    }

    update(delta_time: number) {

    }

    check_collision(other_element: Element): boolean {
        let is_collision = false;
        let this_x = this.model.position.x;
        let this_y = this.model.position.y;

        let other_x = other_element.position.x;
        let other_y = other_element.position.y;

        if (Math.round(this_x) === Math.round(other_x) && Math.round(this_y) === Math.round(other_y)) {
            is_collision = true;
        }
        return is_collision;
    }

    remove() {
        let elements = ControllerGame.instance.elements;
        _.pull(elements, this);
    }
}
