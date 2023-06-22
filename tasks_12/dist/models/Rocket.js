import { MovableElement } from "./MovableElement.js";
export class Rocket extends MovableElement {
    constructor(position, is_down = false) {
        let class_name = 'rocket-up';
        if (is_down) {
            class_name = 'rocket-down';
        }
        super(position, class_name); // data sent to Parent class
        this.is_down = false;
        this.is_down = is_down;
        this.speed = 2.0;
        if (is_down) {
            this.down();
        }
        else {
            this.up();
        }
    }
    update(delta_time) {
        super.update(delta_time);
        if (this.position.get(1) <= 0 || this.position.get(1) >= this._SCENE_HEIGHT - 1) {
            this.remove();
        }
    }
}
//# sourceMappingURL=Rocket.js.map