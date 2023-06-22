// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
// @ts-ignore
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';
import {GameState} from "./GameState.js";


export class ElementBasic {
    _position: nj.array = null;
    #char = 'generic';
    _SCENE_WIDTH = 10;
    _SCENE_HEIGHT = 15;

    _element_id = 0;
    static #element_counter = 0;  // increment

    constructor(position, char = '') {
        this._position = position;
        if (char !== '') {
            this.#char = char
        }
        ElementBasic.#element_counter++;
        this._element_id = ElementBasic.#element_counter;
    }

    set position(pos) {
        if (pos.get(0) < 0) {
            pos.set(0, 0);
        }
        else if (pos.get(0) >= this._SCENE_WIDTH) {
            pos.set(0, this._SCENE_WIDTH);
        }

        if (pos.get(1) < 0) {
            pos.set(1, 0);
        }
        else if (pos.get(1) >= this._SCENE_HEIGHT-1) {
            pos.set(1, this._SCENE_HEIGHT-1);
        }

        this._position = pos;
    }
    get position() {
        return this._position;
    }

    draw(jScene) {
        let jElement = jScene.find(`#el-${this._element_id}`);
        if (jElement.length === 0) {
            jElement = $(`<div id="el-${this._element_id}" class="element ${this.#char}">`);
            jScene.append(jElement);
        }
        jElement.css({
            top: Math.floor(this._position.get(1) * 20),
            left: Math.floor(this._position.get(0) * 20),
        });
    }


    update(delta_time) {

    }

    check_collision(other_element: ElementBasic): boolean {
        let is_collision = false;
        let pos_round = nj.round(this.position);
        let other_round = nj.round(other_element.position);
        if (pos_round.equal(other_round)) {
            is_collision = true;
        }
        return is_collision;
    }

    remove() {
        let elements = GameState.instance.elements;
        lodash.pull(elements, this);
        $(`#el-${this._element_id}`).remove();
    }

}
