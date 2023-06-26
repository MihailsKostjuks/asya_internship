import {Position2D} from "./Position2D";
import {EnumElementType} from "../enums/EnumElementType";

export interface Element {
    type: EnumElementType,
    position: Position2D
}
