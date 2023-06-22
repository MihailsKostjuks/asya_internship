//
// export class Position2D {
//     #position = null;
//     #SCENE_WIDTH = 11;
//     #SCENE_HEIGHT = 15;
//     #is_check_scene = false;
//
//     constructor(position, is_check_scene=true) {
//         this.#position = position
//         this.#is_check_scene = is_check_scene;
//     }
//
//     set position(pos) {
//         if (pos.get(0) < 0) {
//             pos.set(0, 0);
//         }
//         else if (pos.get(0) > this.#SCENE_WIDTH) {
//             pos.set(0, this.#SCENE_HEIGHT);
//         }
//
//         if (pos.get(1) < 0) {
//             pos.set(1, 0);
//         }
//         else if (pos.get(1) > this.#SCENE_WIDTH-1) {
//             pos.set(1, this.#SCENE_HEIGHT-1);
//         }
//
//         this.#position = pos;
//     }
//     get position() {
//         return this.#position;
//     }
// }
