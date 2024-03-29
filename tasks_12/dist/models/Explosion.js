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
var _Explosion_life;
import { ElementBasic } from "./ElementBasic.js";
export class Explosion extends ElementBasic {
    constructor(position) {
        super(position, 'explosion');
        _Explosion_life.set(this, 0.5); // looks weird
    }
    update(delta_time) {
        super.update(delta_time);
        __classPrivateFieldSet(this, _Explosion_life, __classPrivateFieldGet(this, _Explosion_life, "f") - delta_time, "f");
        if (__classPrivateFieldGet(this, _Explosion_life, "f") <= 0) {
            this.remove();
        }
    }
}
_Explosion_life = new WeakMap();
//# sourceMappingURL=Explosion.js.map