
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    //an array to allow random card selection//
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
    
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
const hitSound = new Audio('src/sounds/swish.m4a'); //the sounds//
const winSound = new Audio('src/sounds/cash.mp3');
const lossSound = new Audio('src/sounds/aww.mp3');


document.querySelector('#blackjack-hit-btn').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-btn').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-btn').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
    let card = randomCard()
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    }
}
function randomCard() {
  let randomIndex =  Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomIndex]; 
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `src/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
    
}

//deal function to clear cards//
function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img'); //for yourImages//
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img'); //for the dealer images
        for (i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
        }
        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'white';

        blackjackGame['turnsOver'] = true;
    }
    
}

//function to show current score, the cardMap object helps with attaching value to each card//
 function updateScore(card, activePlayer) {
     if (card === 'A') {
         //sorting out the ACE, if adding 11 keeps me below 21, add 11, otherwise, add 1//
         if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
             activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
         activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }  
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }     
 }
 
 function showScore(activePlayer) {
     if (activePlayer['score'] > 21) {
         document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
         document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
     } else {
         document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
     }
     
 }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

 async function dealerLogic() {
    blackjackGame['isStand'] = true;
    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    

}
//computing the winner//
//Update the wins, losses, and draws to the table at the bottom//
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
  //  condition: higher score than dealer or when dealer busts but you're 21 or under//
      if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
          blackjackGame['wins']++;
          winner = YOU;
      } else if (YOU['score'] < DEALER['score']) {
          blackjackGame['losses']++;
          winner = DEALER;

      } else if (YOU['score'] === DEALER['score']) {
          blackjackGame['draws']++;
      }
     //condition when human player busts but dealer doesn't 
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;

    //Condition when you and the dealer busts
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins']
        message = 'You Won!';
        messageColor = 'lime';
        winSound.play();
    } else if (winner === DEALER) {
        document.querySelector('#losses').textContent = blackjackGame['losses']
        message = 'You Lost!';
        messageColor = 'red';
        lossSound.play();
    } else {
        document.querySelector('#draws').textContent = blackjackGame['draws']
        message = 'You Drew!';
        messageColor = 'black';
    }
    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
    }
}

