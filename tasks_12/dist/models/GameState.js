import { Player } from "./Player.js";
import { Alien } from "./Alien.js";
import { Wall } from "./Wall.js";
// @ts-ignore
import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
import { Rocket } from "./Rocket.js";
import { Explosion } from "./Explosion.js";
export class GameState {
    constructor() {
        this.player = new Player(nj.array([5, 14]));
        this.elements = [];
        this.lives = 3;
        this.score = 0;
        this.jHeader = $('#header');
        this.jScene = $('#scene');
        this.jLives = $(`<div id="header_lives" >`);
        this.jScore = $(`<div id="header_score">Score: <span id="span_score">${this.score}</span></div>`);
        this.alien_amount = 0;
    }
    static get instance() {
        if (!GameState._instance) {
            GameState._instance = new GameState();
        }
        return GameState._instance;
    }
    new_game() {
        this.jHeader.append(this.jScore);
        this.jHeader.append(this.jLives);
        for (let i = 0; i < this.lives; i++) {
            let jLive = $(`<div class="life">`); // or add id
            this.jLives.append(jLive);
        }
        this.jLives.empty();
        this.elements.push(this.player);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let pos = nj.array([3 + j, 4 + i]);
                this.elements.push(new Alien(pos));
                this.alien_amount++;
            }
        }
        for (let i = 0; i < 4; i++) {
            let pos = nj.array([2 + 2 * i, 10]);
            this.elements.push(new Wall(pos));
        }
        let last_alien = this.elements[this.elements.length - 5];
        last_alien.left();
        let event = new CustomEvent('EVENT_ALIEN_CHANGE_DIRECTION', {
            detail: last_alien.direction
        });
        window.dispatchEvent(event);
    }
    update(delta_time) {
        for (let element of this.elements) {
            element.update(delta_time);
        }
    }
    draw() {
        // let jScore = this.jHeader.find(`#header_score`);
        // jScore.remove();
        // jScore = $(`<div id="header_score">Score: <span id="span_score">${this.score}</span></div>`);
        // this.jHeader.append(jScore);
        let jScore = this.jHeader.find('#header_score');
        let spanScore = jScore.find('#span_score');
        spanScore.text(this.score);
        this.jLives.empty();
        for (let i = 0; i < this.lives; i++) {
            let jLive = $(`<div class="life">`); // or add id
            this.jLives.append(jLive);
        }
        for (let element of this.elements) {
            element.draw(this.jScene);
        }
    }
    move_aliens() {
        for (let element of this.elements) {
            if (element instanceof Alien) {
                if (element.check_border()) {
                    break;
                }
            }
        }
    }
    check_collision() {
        let is_collision = false;
        let elements_amount = this.elements.length;
        for (let i = 0; i < elements_amount; i++) {
            let el_i = this.elements[i];
            if (el_i instanceof Rocket) {
                for (let j = 0; j < elements_amount; j++) {
                    let el_j = this.elements[j];
                    if (el_i.is_down) {
                        if (!(el_j instanceof Rocket) && el_j instanceof Player) {
                            if (el_i.check_collision(el_j)) {
                                el_i.remove();
                                is_collision = true;
                                this.lives--;
                                if (this.lives == 0) {
                                    this.elements.push(new Explosion(nj.round(el_j.position.clone())));
                                    el_j.remove();
                                }
                                break;
                            }
                        }
                    }
                    else {
                        if (!(el_j instanceof Rocket) && !(el_j instanceof Player)) {
                            if (el_i.check_collision(el_j)) {
                                this.elements.push(new Explosion(nj.round(el_j.position.clone())));
                                el_i.remove();
                                el_j.remove();
                                is_collision = true;
                                this.score++;
                                this.alien_amount--;
                                console.log(this.score);
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
GameState._instance = null;
//# sourceMappingURL=GameState.js.map