import {ElementBasic} from "./ElementBasic.js";
import {Rocket} from "./Rocket.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
import {GameState} from "./GameState.js";
import {MovableElement} from "./MovableElement.js";

export class Alien extends MovableElement {
    #EVENT_ALIEN_FIRE_ROCKET = 'EVENT_ALIEN_FIRE_ROCKET';
    #EVENT_ALIEN_CHANGE_DIRECTION = 'EVENT_ALIEN_CHANGE_DIRECTION';
    #patience = 0;
    #speed = 0.5;
    #listeners_aliens = [];

    constructor(position) {  // Alien constructor
        super(position, 'alien');  // data sent to Parent class
        this.reset_patience(this.#EVENT_ALIEN_FIRE_ROCKET);
        window.addEventListener(this.#EVENT_ALIEN_FIRE_ROCKET, this.reset_patience);
        window.addEventListener(this.#EVENT_ALIEN_CHANGE_DIRECTION, this.change_direction);
    }

    fire_rocket() {
        window.dispatchEvent(new Event(this.#EVENT_ALIEN_FIRE_ROCKET));
        let pos = nj.round(this.position).add(nj.array([0,1]));
        let rocket = new Rocket(pos, true);
        GameState.instance.elements.push(rocket);
    }

    reset_patience = (event) => {
        this.#patience = Math.random() * 10.0 + 5.0;
    }

    change_direction = (event) => {
        this.direction = event.detail;
        this.position = this.position.add(nj.array([0, 1]));
    }

    update(delta_time) {
        super.update(delta_time);
        this.#patience -= delta_time;
        if (this.#patience <= 0) {
            this.fire_rocket();
            this.reset_patience(this.#EVENT_ALIEN_FIRE_ROCKET);
        }
    }

    notify(event) {

    }

    check_border() {
        let is_border = false;
        if(this.position.get(0) === 0 || this.position.get(0) >= this._SCENE_WIDTH) {
            console.log('touched');
            this.direction = this.direction.multiply(-1);

            let event = new CustomEvent(this.#EVENT_ALIEN_CHANGE_DIRECTION, {
                detail: this.direction
            });
            window.dispatchEvent(event);

            is_border = true;
        }
        return is_border;
    }
}
