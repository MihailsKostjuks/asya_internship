import {Player} from "../models/Player";
import {Position2D} from "../models/Position2D";
import {Alien} from "../models/Alien";
import {Wall} from "../models/Wall";
import {EnumElementType} from "../enums/EnumElementType";
import {Vector2D} from "../models/Vector2D";
import {ControllerElement} from "./ControllerElement";
import {ControllerMovableElement} from "./ControllerMovableElement";
import {ControllerAlien} from "./ControllerAlien";
import {ControllerPlayer} from "./ControllerPlayer";
import {Rocket} from "../models/Rocket";
import {ControllerExplosion} from "./ControllerExplosion";
import {Explosion} from "../models/Explosion";


export class ControllerGame {
    static _instance: ControllerGame | null = null;
    player: Player = {
        position: {
            x: 4.5,
            y: 19
        } as Position2D,
        direction: {
            x: 0,
            y: 0
        } as Vector2D,
        speed: 2,
        type: EnumElementType.player,
    }
    controllerPlayer = new ControllerPlayer(this.player);
    elements: ControllerElement[] = [];
    aliens: ControllerAlien[] = [];
    lives = 3;
    score = 0;
    alien_amount = 0;
    alien_cooldown = 2; // some delay after game start

    static get instance() {
        if (!ControllerGame._instance) {
            ControllerGame._instance = new ControllerGame();
        }
        return ControllerGame._instance;
    }

    new_game() {
        this.elements = [];
        this.elements.push(this.controllerPlayer);

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 6; j++) {
                let pos: Position2D = {
                    x: 2+j,
                    y: 5+i
                }
                let alien: Alien = {
                    position: pos,
                    type: EnumElementType.alien,
                    direction: {
                        x: 1,
                        y: 0
                    } as Vector2D,
                    speed: 1.0
                }
                this.elements.push(new ControllerAlien(alien));
                this.aliens.push(new ControllerAlien(alien));
                this.alien_amount++;
            }
        }

        for(let i = 0; i < 4; i++) {
            let pos: Position2D = {
                x: 2 + 2*i,
                y: 16
            }
            let wall: Wall = {
                position: pos,
                type: EnumElementType.wall,
            }
            this.elements.push(new ControllerElement(wall));
            this.alien_amount++;
        }
    }

    update(delta_time: number) {
        for(let element of this.elements) {
            element.update(delta_time);
        }
        this.move_aliens();
        this.check_collision();
        this.fire_aliens(delta_time);
    }



    move_aliens() {
        for (let element of this.elements) {
            if(element instanceof ControllerAlien) {
                if(element.touch_border()) {
                    for (let element of this.elements) {
                        if(element instanceof ControllerAlien) {
                            element.model.direction.x *= -1;
                            if(element.model.direction.x >= 0) {
                                element.model.position.y -= 1;
                            } else {
                                element.model.position.y += 1;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    fire_aliens(delta_time: number) {
        this.alien_cooldown -= delta_time;
        if (this.alien_cooldown <= 0) {
            let aliens: ControllerAlien[] = [];
            for (let alien of this.elements) {
                if (alien instanceof ControllerAlien) {
                    aliens.push(alien);
                }
            }
            const alien_index = Math.floor(Math.random() * aliens.length);
            aliens[alien_index].fire_rocket();
            this.alien_cooldown = 2;
        }


    }

    check_collision() {
        let is_collision = false;
        let elements_amount = this.elements.length;
        for (let i = 0; i < elements_amount; i++) {
            let cont_i = this.elements[i];
            let el_i = cont_i.model;
            if (el_i.type === EnumElementType.rocket) {
                for (let j = 0; j < elements_amount; j++) {
                    let cont_j = this.elements[j];
                    let el_j = cont_j.model;
                    if (!(el_i as Rocket).is_friendly) {
                        if ( !(el_j.type === EnumElementType.rocket) && el_j.type === EnumElementType.player) {
                            if (cont_i.check_collision(el_j)) {
                                cont_i.remove();
                                is_collision = true;
                                this.lives--;
                                if (this.lives == 0) {
                                    let explosion: Explosion = {
                                        position: {
                                            x: el_j.position.x,
                                            y: el_j.position.y
                                        },
                                        type: EnumElementType.explosion,
                                    }
                                    this.elements.push(new ControllerExplosion(explosion));
                                    cont_j.remove();
                                }
                                break;
                            }
                        }
                    } else {
                        if ( !(el_j.type === EnumElementType.rocket) && !(el_j.type === EnumElementType.player)) {
                            if (cont_i.check_collision(el_j)) {
                                let explosion: Explosion = {
                                    position: {
                                        x: el_j.position.x,
                                        y: el_j.position.y
                                    },
                                    type: EnumElementType.explosion,
                                }
                                this.elements.push(new ControllerExplosion(explosion));
                                cont_i.remove();
                                cont_j.remove();
                                is_collision = true;
                                this.score++;
                                this.alien_amount--;
                                break;
                            }
                        }
                    }
                }
                if (is_collision) {
                    break;
                }
            }
        }
    }

    is_won() {
        return this.alien_amount == 0;
    }

    is_lost() {
        return this.lives == 0;
    }
}
