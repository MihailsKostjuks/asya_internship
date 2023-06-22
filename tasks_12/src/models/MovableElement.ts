import {ElementBasic} from "./ElementBasic.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';

export class MovableElement extends ElementBasic {
    #direction: nj.array = nj.array([0,0]);
    #speed = 1.0;
    constructor(position, char = '') {
        if (char === '') {
            char = 'default_movable';
        }
        super(position, char);
    }

    set speed(speed) {
        this.#speed = speed;
    }

    get speed() {
        return this.#speed;
    }

    set direction(value) {
        this.#direction = value;
    }

    get direction() {
        return this.#direction;
    }

    update(delta_time) {
        super.update(delta_time);
        this.position = this.position.add(this.#direction.multiply(this.#speed * delta_time));

    }

    stop() {
        this.#direction = nj.array([0, 0]);
    }

    left() {
        this.#direction = nj.array([-1, 0]);
    }

    right() {
        this.#direction = nj.array([1, 0]);
    }

    up() {
        this.#direction = nj.array([0, -1]);
    }

    down() {
        this.#direction = nj.array([0, 1]);
    }
}
