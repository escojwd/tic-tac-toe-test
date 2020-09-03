
const SIGN = ['X', 'O'];

let BoxLastId = 0;

function Box(handler){
    const id = ++BoxLastId;
    const div = document.createElement('div');
    div.classList.add('box');

    div.addEventListener('click', function(){
        handler(id);
    });

    return {
        id: id,
        el: div,
        player: null,
        giveItTo: function(player){
            this.player = player;
        },
        render: function(){
            this.el.innerHTML = `<span>${SIGN[this.player]}</span>`;
        }
    }
}

function Board(){
    return {
        boxesEl: document.querySelector('.boxes'),
        boxes: [],
        activePlayer: null,
        reset: function(){
            this.boxes = this.generateBoxes();
            this.render();

            this.activePlayer = Math.floor(Math.random() * 2);
            this.showCurrentPlayer();
        },
        changePlayer: function(){
            this.activePlayer = (this.activePlayer + 1) % 2
        },
        generateBoxes: function(){
            let boxes = [];

            for(let i = 0; i < 9; i++) {
                const box = new Box(id => this.makeAction(id));
                boxes.push(box);
            }

            return boxes;
        },
        showCurrentPlayer: function(){
            const playerTurnEl = document.querySelector(".player-turn");
            playerTurnEl.innerHTML = this.activePlayer !== null ? this.activePlayer + 1 : 'N/A';
        },
        makeAction: function(id){
            const box = this.getBoxById(id);
            if(box.player !== null) {
                alert("ეს უჯრა დაკავებულია ბლიად!");
                return;
            }

            box.giveItTo(this.activePlayer);
            box.render();
            this.changePlayer();
            this.showCurrentPlayer();

            setTimeout(() => {
                const winner = this.findWinner();

                if(winner !== false) {
                    alert("Player " + (winner + 1) + " is winner!!!");
                    if(confirm('Would you like to play again?')) {
                        this.reset();
                    }
                }

                for(let i = 0; i < this.boxes.length; i++) {
                    if(this.boxes[i].player === null) {
                        return;
                    }
                }

                alert('Draw!');
            }, 50);
        },
        render: function(){
            this.boxesEl.innerHTML = '';

            for(let i = 0; i < this.boxes.length; i++) {
                this.boxesEl.appendChild(this.boxes[i].el);
            }
        },
        getBoxById: function(id) {
            return this.boxes.find(box => box.id === id);
        },
        findWinner: function(){
            for(let i = 0; i < 9; i+=3) {
                if(this.boxes[i].player !== null) {
                    if(this.boxes[i].player === this.boxes[i + 1].player && this.boxes[i].player === this.boxes[i + 2].player) {
                        return this.boxes[i].player;
                    }
                }
            }

            for(let i = 0; i < 3; i++) {
                if(this.boxes[i].player !== null) {
                    if(this.boxes[i].player === this.boxes[i + 3].player && this.boxes[i].player === this.boxes[i + 6].player) {
                        return this.boxes[i].player;
                    }
                }
            }
            
            if(this.boxes[4].player !== null) {
                if(this.boxes[0].player === this.boxes[4].player && this.boxes[0].player === this.boxes[8].player) {
                    return this.boxes[0].player;
                }
                
                if(this.boxes[2].player === this.boxes[4].player && this.boxes[2].player === this.boxes[6].player) {
                    return this.boxes[2].player;
                }
            }

            return false;
        }
    }
}


const game = new Board();

game.reset();

document.querySelector('.reset').addEventListener('click', function() {
    game.reset();
})
