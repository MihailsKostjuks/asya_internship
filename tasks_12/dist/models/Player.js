var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Player_coolDown;
import { MovableElement } from "./MovableElement.js";
import { Rocket } from "./Rocket.js";
import { GameState } from "./GameState.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
export class Player extends MovableElement {
    constructor(position) {
        super(position, 'player');
        _Player_coolDown.set(this, 0);
        this.speed = 1.5;
    }
    fire_rocket() {
        if (__classPrivateFieldGet(this, _Player_coolDown, "f") <= 0) {
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
        __classPrivateFieldSet(this, _Player_coolDown, 0.5, "f");
    }
    update(delta_time) {
        super.update(delta_time);
        __classPrivateFieldSet(this, _Player_coolDown, __classPrivateFieldGet(this, _Player_coolDown, "f") - delta_time, "f");
        if (__classPrivateFieldGet(this, _Player_coolDown, "f") <= 0) {
            __classPrivateFieldSet(this, _Player_coolDown, 0, "f");
        }
    }
}
_Player_coolDown = new WeakMap();
//# sourceMappingURL=Player.js.map