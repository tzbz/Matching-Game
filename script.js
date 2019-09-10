class AudioController {
    constructor() {
        this.flipSound = new Audio('/source/audio/card_flip.mp3');
        this.matchSound = new Audio('/source/audio/match.wav');
        this.victorySound = new Audio('/source/audio/victory.wav');
        this.gameOverSound = new Audio('/source/audio/gameover.wav');
        this.flipSound.volume = 0.5;
        this.matchSound.volume = 0.5;
        this.victorySound.volume = 0.5;
        this.gameOverSound.volume = 0.5;
    }
    //Flip Sound
    flip() {
        this.flipSound.play();
    }
    //Match Sound
    match() {
        this.matchSound.play();
    }
    //Victory Sound
    victory() {
        this.victorySound.play();
    }
    //Gameover Sound
    gameOver() {
        this.gameOverSound.play();
    }
}

//Game System
class Matching {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout (() => {
            this.shuffleCards();
            this.countDown = this.startCountdown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;    
    }
//Card System
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');
            if(this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else    
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    canFlipCard(card) {
        //return true;
        return(!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    //Shuffle Algorithm
    shuffleCards() {
        for (let i = this.cardsArray.length - 1 ; i > 0 ; i--){
            console.log("test")
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }
//Timer & Reset
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory').classList.add('visible');
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over').classList.add('visible');
    }
}

//let the page load before run JS
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Matching(100, cards);

    //Game Start
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
           game.startGame();
        });
    });
    
    //Flip cards when click 
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

let audioController = new AudioController();


