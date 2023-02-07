function newGame() {
    generateMap(); // generates a map
    //console.log(field); // field with all the items including pits, wumpus, gold and agent. This output need to be hidden actually
    hideItems();
    console.log('The game has started.')
    showNeighbours();
    console.log(field); // field with Agent and breeze/stench in the vicinity
}

function generateMap() {
    while (pitAmount<3) {
        for (var i = 0; i < 4; i++) { // iterating through the whole field
            for (var j = 0; j < 4; j++) {
                if (field[i][j] !== 'A' && field[i][j] !== 'P') {
                    let min = Math.ceil(1);
                    let max = Math.floor(5);
                    if ((Math.floor(Math.random() * (max - min + 1) + min)) === 3) { // 20% chance that pit will be spawned there

                        field[i][j] = 'P';
                        pits_locations.push([i,j]); // saving pit location
                        breeze_location.push([i+1, j]); // saving breeze location, 4 for each pit
                        breeze_location.push([i-1, j]);
                        breeze_location.push([i, j+1]);
                        breeze_location.push([i, j-1]);

                        pitAmount++;
                        if (pitAmount === 3) {

                            let continue_generate_gold = true;
                            while (continue_generate_gold) {

                                let min01 = Math.ceil(0);
                                let max01 = Math.floor(3);
                                let gold_x = Math.floor(Math.random() * (max01 - min01 + 1) + min01);

                                let min02 = Math.ceil(0);
                                let max02 = Math.floor(3);
                                let gold_y = Math.floor(Math.random() * (max02 - min02 + 1) + min02); // generating place for gold
                                if (field[gold_y][gold_x] !== 'A' && field[gold_y][gold_x] !== 'P') { // make sure gold / pit / actor / Wumpus have their unique place

                                    field[gold_y][gold_x] = 'G';
                                    gold_location.push([gold_y, gold_x]); // saving gold location
                                    continue_generate_gold = false;
                                    let continue_generate_wumpus = true;
                                    while (continue_generate_wumpus) {

                                        let min1 = Math.ceil(0);
                                        let max1 = Math.floor(3);
                                        let wumpus_x = Math.floor(Math.random() * (max1 - min1 + 1) + min1);

                                        let min2 = Math.ceil(0);
                                        let max2 = Math.floor(3);
                                        let wumpus_y = Math.floor(Math.random() * (max2 - min2 + 1) + min2);

                                        if (field[wumpus_y][wumpus_x] !== 'A' && field[wumpus_y][wumpus_x] !== 'P' && field[wumpus_y][wumpus_x] !== 'G') {

                                            field[wumpus_y][wumpus_x] = 'W'; // making the same process for Wumpus and its stench
                                            wumpus_location.push(wumpus_y, wumpus_x);
                                            stench_location.push([wumpus_y+1, wumpus_x]);
                                            stench_location.push([wumpus_y-1, wumpus_x]);
                                            stench_location.push([wumpus_y, wumpus_x+1]);
                                            stench_location.push([wumpus_y, wumpus_x-1]);

                                            continue_generate_wumpus = false;
                                            return field;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function hideItems() { // clearing the map with 15 hashtags # and one actor (player)
    field = [[actor, unseen, unseen, unseen], [unseen, unseen, unseen, unseen],[unseen, unseen, unseen, unseen],[unseen, unseen, unseen, unseen]];
    return field;
}

function move() {
    let prompt = require('prompt-sync') (); // input. User decides where to go.
    const move = prompt('Enter u / d / l / r -------> ');
    let temp_x = x;
    let temp_y = y; // saving actor's previous position. So we can assign it later with # as unseen place
    if (move === 'r' && x<3) { // limiting user input so he can't leave the playing field
        x++;
        field[y][x] = actor; // assigning new actors position
        field[temp_y][temp_x] = unseen; // clearing his last position with #
    } else if (move === 'l' && x>0) { // repeating it with all 4 directions
        x--;
        field[y][x] = actor;
        field[temp_y][temp_x] = unseen;
    } else if (move === 'u' && y>0) {
        y--;
        field[y][x] = actor;
        field[temp_y][temp_x] = unseen;
    } else if (move === 'd' && y<3) {
        y++;
        field[y][x] = actor;
        field[temp_y][temp_x] = unseen;
    } else { // catching error for both wrong keys and tries to leave the field
        console.log('Actor, you cannot leave the field. Fight for your gold!');
    }
    checkIfDeadly(); // calling the function to check whether the actor faced pit/wumpus or no
    checkIfVictory(); // calling the function to check whether the actor found gold or no
    if (!isDeadly && !isVictory) { // if both functions return false, we keep playing
        showNeighbours(); // after the actor moved, it can feel whether any of 4 neighbour fields have breeze or stench or no
        console.log(field); // the field is shown
    }
}

function showNeighbours() {
    for (let i = 0; i<stench_location.length; i++) { // stench_location is an array where we saved wumpus's stench x,y positions

        if (stench_location[i][0] === y+1 && stench_location[i][1] === x && y<3) { // checking whether each of 4 neighbour fields stenches or no
            //console.log('theres stench under you');
            field[y+1][x] = stench;
        }
        if (stench_location[i][0] === y && stench_location[i][1] === x+1 && x<3) {
            //console.log('theres stench to your right');
            field[y][x+1] = stench;

        }
        if (stench_location[i][0] === y-1 && stench_location[i][1] === x && y>0) {
            //console.log('theres stench above you');
            field[y-1][x] = stench;

        }
        if (stench_location[i][0] === y && stench_location[i][1] === x-1 && x>0) {
            //console.log('theres stench to your left');
            field[y][x-1] = stench;

        }
    }

    for (let i = 0; i<breeze_location.length; i++) { // implementing the same process for breeze

        if (breeze_location[i][0] === y+1 && breeze_location[i][1] === x && y<3) {
            //console.log('theres breeze under you');
            if (field[y+1][x] === unseen || field[y+1][x] === breeze) { // showing breeze to the actor breeze
                field[y+1][x] = breeze;
            } else {
                field[y+1][x] = `${stench}+${breeze}`; // If theres already stench, showing both
            }
        }
        if (breeze_location[i][0] === y && breeze_location[i][1] === x+1 && x<3) {
            //console.log('theres breeze to your right');
            if (field[y][x+1] === unseen || field[y][x+1] === breeze) {
                field[y][x+1] = breeze;
            } else {
                field[y][x+1] = `${stench}+${breeze}`;
            }
        }
        if (breeze_location[i][0] === y-1 && breeze_location[i][1] === x && y>0) {
            //console.log('theres breeze above you');
            if (field[y-1][x] === unseen || field[y-1][x] === breeze) {
                field[y-1][x] = breeze;
            } else {
                field[y-1][x] = `${stench}+${breeze}`;
            }
        }
        if (breeze_location[i][0] === y && breeze_location[i][1] === x-1 && x>0) {
            //console.log('theres breeze to your left');
            if (field[y][x-1] === unseen || field[y][x-1] === breeze) {
                field[y][x-1] = breeze;
            } else {
                field[y][x-1] = `${stench}+${breeze}`;
            }
        }
    }
}

function checkIfDeadly() {
    for (let i = 0; i < pits_locations.length; i++) {
        if (y === pits_locations[i][0] && x === pits_locations[i][1]) { // checking if the player fell into the pit
            console.log("You've fallen into the pit. You're dead.");
            isDeadly = true; // in case he did, returning true and ending the game with defeat
        }
    }
    if (y === wumpus_location[0] && x === wumpus_location[1]) { // checking whether players new position coincide (match) with wumpus position
        console.log("You've encountered Wumpus. You're dead.");
        isDeadly = true;
    }
}

function checkIfVictory() {
    if (y === gold_location[0] && x === gold_location[1]) { // checking whether players new position coincide (match) with gold position
        console.log("Congratulations!!! You've found the gold. You've won!");
        isVictory = true;
    }
}

let unseen = '#'; // assigning some global variables
let stench = 'S';
let breeze = 'B';
let actor = 'A';

let field: arr[ ][ ] = [[unseen, unseen, unseen, unseen], [unseen, unseen, unseen, unseen],[unseen, unseen, unseen, unseen],[unseen, unseen, unseen, unseen]];
let pits_locations: arr[] = [];
let gold_location: arr[] = [];
let wumpus_location: arr[] = [];
let stench_location: arr[] = [];
let breeze_location: arr[] = [];

let pitAmount = 0;
let x = 0; // actor's initial position
let y = 0;
field[y][x] = actor;

let isVictory = false;
let isDeadly = false;


newGame(); // starting new game. it includes many other functions like generating the map and hiding items from the player
while (!isVictory && !isDeadly) { // actor moves until he faces Wumpus, falls into a pit or finds the gold
    move();
}



