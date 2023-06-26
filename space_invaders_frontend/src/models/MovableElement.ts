import {Element} from './Element';
import {Vector2D} from "./Vector2D";

export interface MovableElement extends Element {
    direction: Vector2D,
    speed: number,
}
