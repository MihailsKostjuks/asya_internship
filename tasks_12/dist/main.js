var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameState } from "./models/GameState.js";
const DOMAIN = 'http://localhost:8000';
function get_time_seconds() {
    return (Date.now() / 1000.0); // returns s
}
function main_game_loop() {
    let time_current = get_time_seconds();
    let delta_time = time_current - time_before;
    GameState.instance.update(delta_time);
    GameState.instance.move_aliens();
    GameState.instance.check_collision();
    GameState.instance.draw();
    if (GameState.instance.is_won() || GameState.instance.is_lost()) {
        is_game_running = false;
        is_game_over = true;
        show_end_game_overlay();
    }
    time_before = time_current;
    if (is_game_running) {
        setTimeout(main_game_loop, 100);
    }
}
let is_game_running = false;
let is_game_over = false;
GameState.instance.new_game();
let time_before = undefined;
$(document).bind('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        GameState.instance.player.left();
    }
    else if (event.key === 'ArrowRight') {
        GameState.instance.player.right();
    }
    else if (event.key === 's') {
        GameState.instance.player.stop();
    }
    else if (event.key === 'f') {
        GameState.instance.player.fire_rocket();
    }
    else if (event.key === 'Escape') {
        is_game_running = false;
        alert('Game ended');
    }
    else if (event.key === 'g') {
        is_game_running = false;
        show_end_game_overlay();
    }
    if (is_game_running) {
        event.preventDefault();
    }
});
$('#overlay_start #myButton').click((event) => {
    event.preventDefault();
    start_new_game();
});
function start_new_game() {
    $('#overlay_start').css('display', 'none');
    is_game_running = true;
    time_before = get_time_seconds();
    main_game_loop();
}
function show_end_game_overlay() {
    $('#overlay_end').css('display', 'block');
    $('#overlay_end .span_score').text(GameState.instance.score);
}
function get_high_scores() {
    return __awaiter(this, void 0, void 0, function* () {
        // let high_scores_json = Cookies.get(COOKIE_HIGH_SCORES);
        // return JSON.parse(high_scores_json) || [];
        let high_scores = [];
        let response = yield axios.post(DOMAIN + '/get_scores', {
            'some_info': 777
        });
        console.log(response);
        return high_scores;
    });
}
const COOKIE_HIGH_SCORES = 'COOKIE_HIGH_SCORES_4';
if (!Cookies.get(COOKIE_HIGH_SCORES)) {
    let high_scores = [];
    let high_scores_json = JSON.stringify(high_scores);
    Cookies.set(COOKIE_HIGH_SCORES, high_scores_json);
}
$('#overlay_end form:first').submit((event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    let jPlayerName = $('#overlay_end input[name="player_name"]');
    let jPlayerNameStr = jPlayerName.val();
    jPlayerNameStr = jPlayerNameStr.trim();
    let score = GameState.instance.score;
    let high_scores = yield get_high_scores();
    console.log(high_scores);
    let high_score = {
        high_score: score,
        player_name: jPlayerNameStr,
    };
    high_scores.push(high_score);
    let high_scores_json = JSON.stringify(high_scores);
    Cookies.set(COOKIE_HIGH_SCORES, high_scores_json);
    console.log(high_scores);
}));
//# sourceMappingURL=main.js.map