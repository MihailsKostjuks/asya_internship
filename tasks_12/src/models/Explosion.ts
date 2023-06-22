import {ElementBasic} from "./ElementBasic.js";

export class Explosion extends ElementBasic{
    #life = 0.5;  // looks weird
    constructor(position) {
        super(position, 'explosion');
    }

    update(delta_time) {
        super.update(delta_time);
        this.#life -= delta_time;
        if (this.#life <= 0) {
            this.remove();
        }
    }

}
