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
var _MovableElement_direction, _MovableElement_speed;
import { ElementBasic } from "./ElementBasic.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
export class MovableElement extends ElementBasic {
    constructor(position, char = '') {
        if (char === '') {
            char = 'default_movable';
        }
        super(position, char);
        _MovableElement_direction.set(this, nj.array([0, 0]));
        _MovableElement_speed.set(this, 1.0);
    }
    set speed(speed) {
        __classPrivateFieldSet(this, _MovableElement_speed, speed, "f");
    }
    get speed() {
        return __classPrivateFieldGet(this, _MovableElement_speed, "f");
    }
    set direction(value) {
        __classPrivateFieldSet(this, _MovableElement_direction, value, "f");
    }
    get direction() {
        return __classPrivateFieldGet(this, _MovableElement_direction, "f");
    }
    update(delta_time) {
        super.update(delta_time);
        this.position = this.position.add(__classPrivateFieldGet(this, _MovableElement_direction, "f").multiply(__classPrivateFieldGet(this, _MovableElement_speed, "f") * delta_time));
    }
    stop() {
        __classPrivateFieldSet(this, _MovableElement_direction, nj.array([0, 0]), "f");
    }
    left() {
        __classPrivateFieldSet(this, _MovableElement_direction, nj.array([-1, 0]), "f");
    }
    right() {
        __classPrivateFieldSet(this, _MovableElement_direction, nj.array([1, 0]), "f");
    }
    up() {
        __classPrivateFieldSet(this, _MovableElement_direction, nj.array([0, -1]), "f");
    }
    down() {
        __classPrivateFieldSet(this, _MovableElement_direction, nj.array([0, 1]), "f");
    }
}
_MovableElement_direction = new WeakMap(), _MovableElement_speed = new WeakMap();
//# sourceMappingURL=MovableElement.js.map