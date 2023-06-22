import {GameState} from "./models/GameState.js";
import {HighScore} from "./interfaces/HighScore.js";
import {ResponseSessionEnd} from "./interfaces/ResponseSessionEnd.js";

const DOMAIN = 'http://localhost:8000';


// dummy useState alternative
let player_id = undefined;
let session_id = undefined;


function get_time_seconds() {
    return (Date.now() / 1000.0);  // returns s
}

function main_game_loop () {
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


await start_session();

GameState.instance.new_game();
let time_before = undefined;
$(document).bind('keydown', async (event) => {
    if (event.key === 'ArrowLeft') {
        GameState.instance.player.left();
    } else if (event.key === 'ArrowRight') {
        GameState.instance.player.right();
    } else if (event.key === 's') {
        GameState.instance.player.stop();
    } else if (event.key === 'f') {
        GameState.instance.player.fire_rocket();
    } else if (event.key === 'Escape') {
        let response = await end_session();
        if (response.is_session_ended) {
            is_game_running = false;
            alert('Game ended');
        }
    } else if (event.key === 'g') {
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

async function start_session() {
    let response = await axios.post(
        DOMAIN + '/start_session',
        {
            is_session_started: true
        }
    );
    console.log(response.is_success);
    return response.is_success;
}

async function end_session(): Promise<ResponseSessionEnd> {
    let response: ResponseSessionEnd = {
        is_session_ended: false
    };
    try {
        let response_db = await axios.post(
            DOMAIN + '/end_session',
            {
                is_session_ended: true
            }
        );
        console.log(response_db.is_success);
        response.is_session_ended = response_db.is_success;
    } catch (e) {
        console.error(e);
    }
    return response;
}

async function submit_player_name(player_name) {
    let response = {
        is_success: false
    }
    try {
        let response_db = await axios.post(
            DOMAIN + '/register_player',
            {
                player_name: player_name
            }
        )
        if (response_db.is_success) {
            response.is_success = true;
            player_id = response_db.player_id;
            session_id = response_db.session_id;

        }
    } catch (e) {
        console.error(e);
    }
    return response;
}

async function submit_score(score) {
    let response = {
        is_success: false
    }
    try {
        let response_db = await axios.post(
            DOMAIN + '/insert_scores',
            {
                score: score
            }
        )
        if (response_db.is_success) {
            response.is_success = true
        }
    } catch (e) {
        console.error(e);
    }
    return response;
}

async function get_high_scores() {
    // let high_scores_json = Cookies.get(COOKIE_HIGH_SCORES);
    // return JSON.parse(high_scores_json) || [];
    let high_scores = [];

    let response = await axios.post(
        DOMAIN + '/get_scores',
        {
            player_id: player_id
        });
    console.log(response);

    return high_scores;
}

const COOKIE_HIGH_SCORES = 'COOKIE_HIGH_SCORES_4';
if (!Cookies.get(COOKIE_HIGH_SCORES)) {
    let high_scores = [];
    let high_scores_json = JSON.stringify(high_scores);
    Cookies.set(COOKIE_HIGH_SCORES, high_scores_json);
}


$('#overlay_end form:first').submit( async (event) => {
    event.preventDefault();
    let jPlayerName = $('#overlay_end input[name="player_name"]');
    let jPlayerNameStr = jPlayerName.val() as string;
    jPlayerNameStr = jPlayerNameStr.trim();
    let score = GameState.instance.score;

    let response = await submit_player_name(jPlayerNameStr);
    if (response.is_success) {
        let response = await submit_score(score);
        if (response.is_success) {
            let high_scores = await get_high_scores();

        }
    }

    // let high_scores = await get_high_scores();
    // console.log(high_scores)
    //
    // let high_score: HighScore = {
    //     high_score: score,
    //     player_name: jPlayerNameStr,
    // };
    //
    // high_scores.push(high_score);
    // let high_scores_json = JSON.stringify(high_scores);
    // Cookies.set(COOKIE_HIGH_SCORES, high_scores_json);
    //
    // console.log(high_scores);
});

