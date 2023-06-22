import {MovableElement} from "./MovableElement.js";
import {Rocket} from "./Rocket.js";
import {GameState} from "./GameState.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';

export class Player extends MovableElement {
    #coolDown = 0;

    constructor(position) {
        super(position, 'player');
        this.speed = 1.5;
    }

    fire_rocket() {
        if (this.#coolDown <= 0) {
            let pos_rocket = nj.round(this.position);
            // pos_rocket = pos_rocket.subtract(nj.array([0, -2]));
            let rocket = new Rocket(pos_rocket);
            rocket.position = rocket.position.subtract(nj.array([0, 1]));
            rocket.up();
            let elements = GameState.instance.elements;
            elements.push(rocket);
            this.set_coolDown();
        }
    }

    set_coolDown() {
        this.#coolDown = 0.5;
    }

    update(delta_time) {
        super.update(delta_time);
        this.#coolDown -= delta_time;
        if (this.#coolDown <= 0) {
            this.#coolDown = 0;
        }
    }
}
