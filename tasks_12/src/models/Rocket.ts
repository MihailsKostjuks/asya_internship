import {MovableElement} from "./MovableElement.js";
import {GameState} from "./GameState.js";
// @ts-ignore
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';

export class Rocket extends MovableElement {
    is_down = false;
    constructor(position, is_down=false) {  // Alien constructor
        let class_name = 'rocket-up';
        if (is_down) {
            class_name = 'rocket-down';
        }
        super(position, class_name);  // data sent to Parent class
        this.is_down = is_down;
        this.speed = 2.0;
        if (is_down) {
            this.down();
        } else {
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
