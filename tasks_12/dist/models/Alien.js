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
var _Alien_EVENT_ALIEN_FIRE_ROCKET, _Alien_EVENT_ALIEN_CHANGE_DIRECTION, _Alien_patience, _Alien_speed, _Alien_listeners_aliens;
import { Rocket } from "./Rocket.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
import { GameState } from "./GameState.js";
import { MovableElement } from "./MovableElement.js";
export class Alien extends MovableElement {
    constructor(position) {
        super(position, 'alien'); // data sent to Parent class
        _Alien_EVENT_ALIEN_FIRE_ROCKET.set(this, 'EVENT_ALIEN_FIRE_ROCKET');
        _Alien_EVENT_ALIEN_CHANGE_DIRECTION.set(this, 'EVENT_ALIEN_CHANGE_DIRECTION');
        _Alien_patience.set(this, 0);
        _Alien_speed.set(this, 0.5);
        _Alien_listeners_aliens.set(this, []);
        this.reset_patience = (event) => {
            __classPrivateFieldSet(this, _Alien_patience, Math.random() * 10.0 + 5.0, "f");
        };
        this.change_direction = (event) => {
            this.direction = event.detail;
            this.position = this.position.add(nj.array([0, 1]));
        };
        this.reset_patience(__classPrivateFieldGet(this, _Alien_EVENT_ALIEN_FIRE_ROCKET, "f"));
        window.addEventListener(__classPrivateFieldGet(this, _Alien_EVENT_ALIEN_FIRE_ROCKET, "f"), this.reset_patience);
        window.addEventListener(__classPrivateFieldGet(this, _Alien_EVENT_ALIEN_CHANGE_DIRECTION, "f"), this.change_direction);
    }
    fire_rocket() {
        window.dispatchEvent(new Event(__classPrivateFieldGet(this, _Alien_EVENT_ALIEN_FIRE_ROCKET, "f")));
        let pos = nj.round(this.position).add(nj.array([0, 1]));
        let rocket = new Rocket(pos, true);
        GameState.instance.elements.push(rocket);
    }
    update(delta_time) {
        super.update(delta_time);
        __classPrivateFieldSet(this, _Alien_patience, __classPrivateFieldGet(this, _Alien_patience, "f") - delta_time, "f");
        if (__classPrivateFieldGet(this, _Alien_patience, "f") <= 0) {
            this.fire_rocket();
            this.reset_patience(__classPrivateFieldGet(this, _Alien_EVENT_ALIEN_FIRE_ROCKET, "f"));
        }
    }
    notify(event) {
    }
    check_border() {
        let is_border = false;
        if (this.position.get(0) === 0 || this.position.get(0) >= this._SCENE_WIDTH) {
            console.log('touched');
            this.direction = this.direction.multiply(-1);
            let event = new CustomEvent(__classPrivateFieldGet(this, _Alien_EVENT_ALIEN_CHANGE_DIRECTION, "f"), {
                detail: this.direction
            });
            window.dispatchEvent(event);
            is_border = true;
        }
        return is_border;
    }
}
_Alien_EVENT_ALIEN_FIRE_ROCKET = new WeakMap(), _Alien_EVENT_ALIEN_CHANGE_DIRECTION = new WeakMap(), _Alien_patience = new WeakMap(), _Alien_speed = new WeakMap(), _Alien_listeners_aliens = new WeakMap();
//# sourceMappingURL=Alien.js.map