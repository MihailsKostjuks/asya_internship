let prompt = require('prompt-sync') ();

class Game {
    private actors: Actor[]
    private items: Item[]
    private mapSize: Position
    private mapHidden: boolean[][]
    private field: string[][]


    constructor() {
        this.actors = [new Agent()];
        this.items = [];
        this.actors[0].position = {
            x: 0,
            y: 0
        }
        this.mapSize = {
            x:4,
            y:4
        }
        var unseen = '#';
        var actor = 'A';
        this.field = new Array(this.mapSize.x).fill(unseen).map(()=>new Array(this.mapSize.y).fill(unseen));
        this.field[this.actors[0].position.y][this.actors[0].position.x] = actor;
    }


    newGame() {
        let pitAmount = 0;
        while (pitAmount<3) {
            let pit_x = Math.floor(Math.random()*4); // generating place for gold
            let pit_y = Math.floor(Math.random()*4);
            if (this.field[pit_y][pit_x] !== 'A' && this.field[pit_y][pit_x] !== 'P') {
                this.field[pit_y][pit_x] = 'P';
                this.items.push(new Pit());
                this.items[pitAmount].position = {
                    x: pit_x,
                    y: pit_y
                }
                pitAmount++;
                if (pitAmount === 3) {

                    let continue_generate_gold = true;
                    while (continue_generate_gold) {

                        let gold_x = Math.floor(Math.random() * 4); // generating place for gold
                        let gold_y = Math.floor(Math.random() * 4);
                        if (this.field[gold_y][gold_x] !== 'A' && this.field[gold_y][gold_x] !== 'P') { // make sure gold / pit / actor / Wumpus have their unique place

                            this.field[gold_y][gold_x] = 'G';
                            this.items.push(new Gold());
                            this.items[pitAmount].position = {
                                x: gold_x,
                                y: gold_y
                            }
                            continue_generate_gold = false;
                            let continue_generate_wumpus = true;
                            while (continue_generate_wumpus) {

                                let wumpus_x = Math.floor(Math.random() * 4); // generating place for gold
                                let wumpus_y = Math.floor(Math.random() * 4);

                                if (this.field[wumpus_y][wumpus_x] !== 'A' && this.field[wumpus_y][wumpus_x] !== 'P' && this.field[wumpus_y][wumpus_x] !== 'G') {

                                    this.field[wumpus_y][wumpus_x] = 'W'; // making the same process for Wumpus and its stench
                                    this.actors.push(new Wumpus());
                                    this.actors[1].position = {
                                        x: wumpus_x,
                                        y: wumpus_y
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
        for (let i = 0; i < this.items.length; i ++) {
            if (this.items[i] instanceof Pit) {
                this.items.push(new Breeze());
                this.items[this.items.length - 1].position = {
                    x: this.items[i].position.x + 1,
                    y: this.items[i].position.y
                }

                this.items.push(new Breeze());
                this.items[this.items.length - 1].position = {
                    x: this.items[i].position.x,
                    y: this.items[i].position.y + 1
                }


                this.items.push(new Breeze());
                this.items[this.items.length - 1].position = {
                    x: this.items[i].position.x - 1,
                    y: this.items[i].position.y
                }

                this.items.push(new Breeze());
                this.items[this.items.length - 1].position = {
                    x: this.items[i].position.x,
                    y: this.items[i].position.y - 1
                }

            }
        }

        for (let i = 0; i < this.actors.length; i ++) {
            if (this.actors[i] instanceof Wumpus) {
                this.items.push(new Stench());
                this.items[this.items.length - 1].position = {
                    x: this.actors[i].position.x + 1,
                    y: this.actors[i].position.y
                }

                this.items.push(new Stench());
                this.items[this.items.length - 1].position = {
                    x: this.actors[i].position.x,
                    y: this.actors[i].position.y + 1
                }

                this.items.push(new Stench());
                this.items[this.items.length - 1].position = {
                    x: this.actors[i].position.x - 1,
                    y: this.actors[i].position.y
                }
                this.items.push(new Stench());
                this.items[this.items.length - 1].position = {
                    x: this.actors[i].position.x,
                    y: this.actors[i].position.y - 1
                }
            }
        }
        console.log(this.items);
        let items_to_be_deleted = [];
        // deleting redundant breezes and stenches with not existing coordinates
        for (let i = 0; i < this.items.length; i ++) {
            if ((this.items[i] instanceof Breeze) || (this.items[i] instanceof Stench)) {
                if (this.items[i].position.x > (this.mapSize.x - 1)) {
                    items_to_be_deleted.push(i);
                }
                else if (this.items[i].position.x < 0) {
                    items_to_be_deleted.push(i);
                }
                else if (this.items[i].position.y < 0) {
                    items_to_be_deleted.push(i);
                }
                else if (this.items[i].position.y > (this.mapSize.y - 1)) {
                    items_to_be_deleted.push(i);
                }
            }
        }

        let j = 0;
        for (let i = 0; i < items_to_be_deleted.length; i++) {
            this.items.splice(items_to_be_deleted[i] - j, 1);
            j++;
        }
        let game_over = false;
        while (!game_over) {
            console.log(this.items)
            console.log(this.actors)
            this.drawGame();
            const move = prompt('Enter u / d / l / r -------> ');
            this.movePlayer(move); // ar enumiem neiet
            this.isStench();
            this.isBreeze();
            // checking if lost or no
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i] instanceof Pit) {
                    if (this.actors[0].position.x === this.items[i].position.x) {
                        if (this.actors[0].position.y === this.items[i].position.y) {
                            this.items[i].isDeadly(true);
                            game_over = true;
                        }
                    }
                }
            }
            if (this.actors[0].position.x === this.actors[1].position.x) {
                if (this.actors[0].position.y === this.actors[1].position.y) {
                    this.actors[1].isDeadly(true); // tam nav logikas =(
                    game_over = true;
                }
            }
            if (game_over === true) {
                console.log('You lost the game!');
                break;
            }
            // checking if won or no
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i] instanceof Gold) {
                    if (this.actors[0].position.x === this.items[i].position.x) {
                        if (this.actors[0].position.y === this.items[i].position.y) {
                            this.items[i].isVictory(true);
                            game_over = true;
                        }
                    }
                }
            }
            if (game_over === true) {
                console.log('Congratulations! You won the game!')
            }
        }
    }

    movePlayer(direction: string) {
        let temp_x = this.actors[0].position.x;
        let temp_y = this.actors[0].position.y; // saving actor's previous position. So we can assign it later with # as unseen place
        if (direction === "r" && this.actors[0].position.x < this.mapSize.x - 1) { // limiting user input so he can't leave the playing field
            this.actors[0].position = {
                x: temp_x + 1,
                y: temp_y
            };
            this.field[this.actors[0].position.y][this.actors[0].position.x] = 'A'; // assigning new actors position#
            this.field[temp_y][temp_x] = '#'; // clearing his last position with #
        }
        else if (direction === 'l' && this.actors[0].position.x > 0) { // repeating it with all 4 directions
            this.actors[0].position = {
                x: temp_x - 1,
                y: temp_y
            };
            this.field[this.actors[0].position.y][this.actors[0].position.x] = 'A';
            this.field[temp_y][temp_x] = '#';
        }
        else if (direction === 'u' && this.actors[0].position.y > 0) {
            this.actors[0].position = {
                x: temp_x,
                y: temp_y - 1
            };
            this.field[this.actors[0].position.y][this.actors[0].position.x] = 'A';
            this.field[temp_y][temp_x] = '#';
        }
        else if (direction === 'd' && this.actors[0].position.y < this.mapSize.y - 1) {
            this.actors[0].position = {
                x: temp_x,
                y: temp_y + 1
            };
            this.field[this.actors[0].position.y][this.actors[0].position.x] = 'A';
            this.field[temp_y][temp_x] = '#';
        }
        else { // catching error for both wrong keys and tries to leave the field
            console.log('Actor, you cannot leave the field. Fight for your gold!');
        }
    }

    drawGame() {
        console.log('Playing field: ');
        console.log(this.field)

    }

    isStench() {
        for (let i = 0; i < this.items.length; i++) {
            // console.log(this.items[i]);
            if (this.items[i] instanceof Stench){
                if (this.actors[0].position.x === this.items[i].position.x) {
                    if (this.actors[0].position.y === this.items[i].position.y + 1) {
                        this.field[this.items[i].position.y][this.items[i].position.x] = 'S';
                    }
                    if (this.actors[0].position.y === this.items[i].position.y - 1) {
                        this.field[this.items[i].position.y][this.items[i].position.x] = 'S';
                    }
                }
                if (this.actors[0].position.y === this.items[i].position.y) {
                    if (this.actors[0].position.x === this.items[i].position.x + 1) {
                        this.field[this.items[i].position.y][this.items[i].position.x] = 'S';
                    }
                    if (this.actors[0].position.x === this.items[i].position.x - 1) {
                        this.field[this.items[i].position.y][this.items[i].position.x] = 'S';
                    }
                }
            }
        }
    }

    isBreeze() {
        for (let i = 0; i < this.items.length; i++) {
            // console.log(this.items[i]);
            if (this.items[i] instanceof Breeze){
                if (this.actors[0].position.x === this.items[i].position.x) {
                    if (this.actors[0].position.y === this.items[i].position.y + 1) {
                        if (this.field[this.items[i].position.y][this.items[i].position.x] === 'S') {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'S+B';
                        } else {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'B';
                        }
                    }
                    if (this.actors[0].position.y === this.items[i].position.y - 1) {
                        if (this.field[this.items[i].position.y][this.items[i].position.x] === 'S') {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'S+B';
                        } else {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'B';
                        }
                    }
                }
                if (this.actors[0].position.y === this.items[i].position.y) {
                    if (this.actors[0].position.x === this.items[i].position.x + 1) {
                        if (this.field[this.items[i].position.y][this.items[i].position.x] === 'S') {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'S+B';
                        } else {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'B';
                        }
                    }
                    if (this.actors[0].position.x === this.items[i].position.x - 1) {
                        if (this.field[this.items[i].position.y][this.items[i].position.x] === 'S') {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'S+B';
                        } else {
                            this.field[this.items[i].position.y][this.items[i].position.x] = 'B';
                        }
                    }
                }
            }
        }
    }
}

interface Position {
    x?: number
    y?: number
}

enum EnumMoveDirection {
    "u" = "UP",
    "d" = "DOWN",
    "r" = "RIGHT",
    "l" = "LEFT"
}

class Item {
    public position: Position

    isDeadly(bool): boolean {
        return false;
    }
    isVictory(bool): boolean {
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
    isDeadly(bool): boolean {
        if (bool === true) {
            return true;
        }
        return false;
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
    isVictory(bool): boolean {
        if (bool === true) {
            return true;
        }
        return false;
    }
}

class Pit  extends ItemImmovable {
    isDeadly(bool): boolean {
        if (bool === true) {
            return true;
        }
        return false;
    }
}

const game = new Game();
game.newGame()
