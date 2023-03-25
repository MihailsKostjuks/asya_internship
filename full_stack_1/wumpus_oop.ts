let prompt = require('prompt-sync') ();

class Game {
    private actors: Actor[];
    private items: Item[];
    private mapSize: Position;
    private field: string[][];


    constructor() {
        this.actors = [];
        this.actors.push(new Agent());
        this.items = [];
        this.actors[0].position = {
            x: 0,
            y: 0
        }
        this.mapSize = {
            x:4,
            y:4
        }

        this.field = new Array(this.mapSize.x)
            .fill('#').map(
                ()=>new Array(this.mapSize.y)
                    .fill('#')
            );
        for (let actor of this.actors) {
            if (actor instanceof Agent) {
                let x = actor.position.x;
                let y = actor.position.y;
                this.field[y][x] = 'A';
            }
        }
    }


    newGame() {
        let pitAmount: number = 0;
        while (pitAmount<3) {
            let pit_x: number = Math.floor(Math.random()*4); // generating place for gold
            let pit_y: number = Math.floor(Math.random()*4);
            if (this.field[pit_y][pit_x] !== 'A' && this.field[pit_y][pit_x] !== 'P') {
                this.field[pit_y][pit_x] = 'P';
                this.items.push(new Pit());
                this.items[pitAmount].position = {
                    x: pit_x,
                    y: pit_y
                }
                pitAmount++;
                if (pitAmount === 3) {

                    let continue_generate_gold: boolean = true;
                    while (continue_generate_gold) {

                        let gold_x: number = Math.floor(Math.random() * 4); // generating place for gold
                        let gold_y: number = Math.floor(Math.random() * 4);
                        if (this.field[gold_y][gold_x] !== 'A' && this.field[gold_y][gold_x] !== 'P') { // make sure gold / pit / actor / Wumpus have their unique place

                            this.field[gold_y][gold_x] = 'G';
                            this.items.push(new Gold());
                            this.items[pitAmount].position = {
                                x: gold_x,
                                y: gold_y
                            }
                            continue_generate_gold = false;
                            let continue_generate_wumpus: boolean = true;
                            while (continue_generate_wumpus) {

                                let wumpus_x: number = Math.floor(Math.random() * 4); // generating place for gold
                                let wumpus_y: number = Math.floor(Math.random() * 4);

                                if (this.field[wumpus_y][wumpus_x] !== 'A' && this.field[wumpus_y][wumpus_x] !== 'P' && this.field[wumpus_y][wumpus_x] !== 'G') {

                                    this.field[wumpus_y][wumpus_x] = 'W'; // making the same process for Wumpus and its stench
                                    this.actors.push(new Wumpus());
                                    for (let actor of this.actors) {
                                        if (actor instanceof Wumpus) {
                                            actor.position = {
                                                x: wumpus_x,
                                                y: wumpus_y
                                            }
                                        }
                                    }

                                    continue_generate_wumpus = false;
                                }
                            }
                        }
                    }
                }
            }
        }
        // hiding wumpus pits and gold
        for (let i = 0; i < this.mapSize.y; i++) {
            for (let j = 0; j < this.mapSize.x; j++) {
                if (this.field[j][i] !== 'A') {
                    this.field[j][i] = '#';
                }
            }
        }

        // adding breeze & stench
        for (let item of this.items) {
            if (item instanceof Pit) {
                let length: number = this.items.length;
                this.items.push(new Breeze());
                this.items[length].position = {
                    x: item.position.x + 1,
                    y: item.position.y
                }

                this.items.push(new Breeze());
                this.items[length + 1].position = {
                    x: item.position.x,
                    y: item.position.y + 1
                }


                this.items.push(new Breeze());
                this.items[length + 2].position = {
                    x: item.position.x - 1,
                    y: item.position.y
                }

                this.items.push(new Breeze());
                this.items[length + 3].position = {
                    x: item.position.x,
                    y: item.position.y - 1
                }

            }
        }

        for (let actor of this.actors) {
            if (actor instanceof Wumpus) {
                let length: number = this.items.length;
                let wumpus_pos_x: number = actor.position.x;
                let wumpus_pos_y: number = actor.position.y;
                this.items.push(new Stench());
                this.items[length].position = {
                    x: wumpus_pos_x + 1,
                    y: wumpus_pos_y
                }

                this.items.push(new Stench());
                this.items[length + 1].position = {
                    x: wumpus_pos_x,
                    y: wumpus_pos_y + 1
                }


                this.items.push(new Stench());
                this.items[length + 2].position = {
                    x: wumpus_pos_x - 1,
                    y: wumpus_pos_y
                }

                this.items.push(new Stench());
                this.items[length + 3].position = {
                    x: wumpus_pos_x,
                    y: wumpus_pos_y - 1
                }

            }
        }
        console.log(this.items);
        let items_to_be_deleted: number[] = [];
        // creating new list with redundant breezes and stenches with not existing coordinates
        for (let item of this.items) {
            if ((item instanceof Breeze) || (item instanceof Stench)) {
                let item_pox_x: number = item.position.x;
                let item_pox_y: number = item.position.y;
                let range_x: number = this.mapSize.x - 1;
                let range_y: number = this.mapSize.y - 1;
                let item_index: number = this.items.indexOf(item);
                if (item_pox_x > range_x) {
                    items_to_be_deleted.push(item_index);
                }
                else if (item_pox_x < 0) {
                    items_to_be_deleted.push(item_index);
                }
                else if (item_pox_y < 0) {
                    items_to_be_deleted.push(item_index);
                }
                else if (item_pox_y > range_y) {
                    items_to_be_deleted.push(item_index);
                }
            }
        }
        // deleting these redundant breezes and stenches with not existing coordinates
        let j: number = 0;
        for (let i = 0; i < items_to_be_deleted.length; i++) {
            let index_for_deletion: number = items_to_be_deleted[i] - j;
            this.items.splice(index_for_deletion, 1);
            j++;
        }

        console.log(this.items);


        let game_over: boolean= false;
        while (!game_over) {
            this.drawGame();
            const move = prompt('Enter u / d / l / r -------> ');
            this.movePlayer(move); // ar enumiem neiet
            this.isStench();
            this.isBreeze();
            // checking if lost or no
            for (let actor of this.actors) {
                if (actor instanceof Agent) {
                    // checking collision with Pit
                    for (let item of this.items) {
                        if (item instanceof Pit) {
                            if (actor.position.x === item.position.x) {
                                if (actor.position.y === item.position.y) {
                                    item.isDeadly();
                                    game_over = true;
                                }
                            }
                        }
                    }
                    // checking collision with Wumpus
                    for (let wumpus of this.actors) {
                        if (wumpus instanceof Wumpus) {
                            if (actor.position.x === wumpus.position.x) {
                                if (actor.position.y === wumpus.position.y) {
                                    wumpus.isDeadly();
                                    game_over = true;
                                }
                            }
                        }
                    }
                }
            }

            if (game_over) {
                console.log('You lost the game!');
                break;
            }
            // checking if won or no
            for (let actor of this.actors) {
                if (actor instanceof Agent) {
                    for (let item of this.items) {
                        if (item instanceof Gold) {
                            if (actor.position.x === item.position.x) {
                                if (actor.position.y === item.position.y) {
                                    item.isVictory();
                                    game_over = true;
                                }
                            }
                        }
                    }
                }
            }
            if (game_over) {
                console.log('Congratulations! You won the game!')
            }
        }
    }

    movePlayer(direction: string) {
        for (let actor of this.actors) {
            if (actor instanceof Agent) {
                let temp_x: number = actor.position.x;
                let temp_y: number = actor.position.y; // saving actor's previous position. So we can assign it later with # as unseen place
                let map_size_x: number = this.mapSize.x;
                let map_size_y: number = this.mapSize.y;
                if (direction === "r" && temp_x < map_size_x - 1) { // limiting user input so he can't leave the playing field
                    actor.position = {
                        x: temp_x + 1,
                        y: temp_y
                    };
                }
                else if (direction === 'l' && temp_x > 0) { // repeating it with all 4 directions
                    actor.position = {
                        x: temp_x - 1,
                        y: temp_y
                    };
                }
                else if (direction === 'u' && temp_y > 0) {
                    actor.position = {
                        x: temp_x,
                        y: temp_y - 1
                    };
                }
                else if (direction === 'd' && temp_y < map_size_y - 1) {
                    actor.position = {
                        x: temp_x,
                        y: temp_y + 1
                    };
                }
                else { // catching error for both wrong keys and tries to leave the field
                    console.log('Actor, you cannot leave the field. Fight for your gold!');
                }
                let new_actor_pos_x: number = actor.position.x;
                let new_actor_pos_y: number = actor.position.y;
                this.field[new_actor_pos_y][new_actor_pos_x] = 'A'; // assigning new actors position#
                this.field[temp_y][temp_x] = '#'; // clearing his last position with #
            }
        }
    }

    drawGame() {
        console.log('Playing field: ');
        console.log(this.field)

    }

    isStench() {
        for (let actor of this.actors) {
            if (actor instanceof Agent) {
                let agent_pos_x: number = actor.position.x;
                let agent_pos_y: number = actor.position.y;
                for (let item of this.items) {
                    if (item instanceof Stench) {
                        let stench_pos_x: number = item.position.x;
                        let stench_pos_y: number = item.position.y;
                        if (agent_pos_x === stench_pos_x) {
                            if (agent_pos_y === stench_pos_y + 1) {
                                this.field[stench_pos_y][stench_pos_x] = 'S';
                            }
                            if (agent_pos_y === stench_pos_y - 1) {
                                this.field[stench_pos_y][stench_pos_x] = 'S';
                            }
                        }
                        if (agent_pos_y === stench_pos_y) {
                            if (agent_pos_x === stench_pos_x + 1) {
                                this.field[stench_pos_y][stench_pos_x] = 'S';
                            }
                            if (agent_pos_x === stench_pos_x - 1) {
                                this.field[stench_pos_y][stench_pos_x] = 'S';
                            }
                        }
                    }
                }
            }
        }
    }

    isBreeze() {
        for (let actor of this.actors) {
            if (actor instanceof Agent) {
                let agent_pos_x: number = actor.position.x;
                let agent_pos_y: number = actor.position.y;
                for (let item of this.items) {
                    if (item instanceof Breeze) {
                        let breeze_pos_x: number = item.position.x;
                        let breeze_pos_y: number = item.position.y;
                        if (agent_pos_x === breeze_pos_x) {
                            if (agent_pos_y === breeze_pos_y + 1) {
                                if (this.field[breeze_pos_y][breeze_pos_x] === 'S') {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'S+B';
                                }
                                else {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'B';
                                }
                            }
                            if (agent_pos_y === breeze_pos_y - 1) {
                                if (this.field[breeze_pos_y][breeze_pos_x] === 'S') {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'S+B';
                                }
                                else {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'B';
                                }
                            }
                        }
                        if (agent_pos_y === agent_pos_y) {
                            if (breeze_pos_x === breeze_pos_x + 1) {
                                if (this.field[breeze_pos_y][breeze_pos_x] === 'S') {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'S+B';
                                }
                                else {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'B';
                                }
                            }
                            if (breeze_pos_x === breeze_pos_x - 1) {
                                if (this.field[breeze_pos_y][breeze_pos_x] === 'S') {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'S+B';
                                }
                                else {
                                    this.field[breeze_pos_y][breeze_pos_x] = 'B';
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}

interface Position {
    x: number
    y: number
}

enum EnumMoveDirection {
    "u" = "UP",
    "d" = "DOWN",
    "r" = "RIGHT",
    "l" = "LEFT"
}

class Item {
    public position: Position = {
        x: 0,
        y: 0
    }

    isDeadly(): boolean {
        return false;
    }
    isVictory(): boolean {
        return false;
    }
}

class Actor extends Item {
    move (direction: EnumMoveDirection) {

    }
}

class Agent extends Actor {

}

class Wumpus extends Actor {
    isDeadly(): boolean {
        super.isDeadly();
        return true;
    }
}
class ItemImmovable extends Item {
    IsTemporary() {

    }
}

class Stench  extends ItemImmovable {

}

class Breeze extends ItemImmovable {

}

class Gold  extends ItemImmovable {
    isVictory(): boolean {
        super.isVictory();
        return true;
    }
}

class Pit  extends ItemImmovable {
    isDeadly(): boolean {
        super.isDeadly();
        return true;
    }
}

const game = new Game();
game.newGame()
