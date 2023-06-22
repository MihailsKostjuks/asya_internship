var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ElementBasic_char, _ElementBasic_element_counter;
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
// @ts-ignore
import lodash from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';
import { GameState } from "./GameState.js";
export class ElementBasic {
    constructor(position, char = '') {
        var _b, _c;
        this._position = null;
        _ElementBasic_char.set(this, 'generic');
        this._SCENE_WIDTH = 10;
        this._SCENE_HEIGHT = 15;
        this._element_id = 0;
        this._position = position;
        if (char !== '') {
            __classPrivateFieldSet(this, _ElementBasic_char, char, "f");
        }
        __classPrivateFieldSet(_b = ElementBasic, _a, (_c = __classPrivateFieldGet(_b, _a, "f", _ElementBasic_element_counter), _c++, _c), "f", _ElementBasic_element_counter);
        this._element_id = __classPrivateFieldGet(ElementBasic, _a, "f", _ElementBasic_element_counter);
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
        else if (pos.get(1) >= this._SCENE_HEIGHT - 1) {
            pos.set(1, this._SCENE_HEIGHT - 1);
        }
        this._position = pos;
    }
    get position() {
        return this._position;
    }
    draw(jScene) {
        let jElement = jScene.find(`#el-${this._element_id}`);
        if (jElement.length === 0) {
            jElement = $(`<div id="el-${this._element_id}" class="element ${__classPrivateFieldGet(this, _ElementBasic_char, "f")}">`);
            jScene.append(jElement);
        }
        jElement.css({
            top: Math.floor(this._position.get(1) * 20),
            left: Math.floor(this._position.get(0) * 20),
        });
    }
    update(delta_time) {
    }
    check_collision(other_element) {
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
_a = ElementBasic, _ElementBasic_char = new WeakMap();
_ElementBasic_element_counter = { value: 0 }; // increment
//# sourceMappingURL=ElementBasic.js.map