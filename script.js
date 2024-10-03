const gameContainer = document.getElementById("game");
let firstCard = null
let secondCard = null
let lockBoard = false;
let totalScore = 0;
let highScore = 0;
const scoreElement = document.getElementById('score');
const homeButton = document.getElementById('homeButton');
const gameContent = document.getElementById('gameContent');
const startButton = document.getElementById('startButton');

document.addEventListener('DOMContentLoaded', () => {
  loadHighScore();
  loadGameState();

  // Always set screen state to 'home' on page load
  showHome();
});

function showHome() {
  // Save the current game state
  saveGameState();
  
  // Save the screen state as 'home'
  localStorage.setItem('screenState', 'home');
  
  // Hide the game content and show the start button
  gameContent.style.display = 'none';
  startButton.style.display = 'block';
  homeButton.style.display = 'none';
}

function startGame() {
  // Show the game content and hide the start button
  startButton.style.display = 'none';
  homeButton.style.display = 'block';
  gameContent.style.display = 'block';

  // Save the screen state as 'game'
  localStorage.setItem('screenState', 'game');

  // Load the game state
  loadGameState();
}

document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('backgroundMusic');
  const startButton = document.getElementById('startButton');
  const screenState = localStorage.getItem('screenState') || 'home';

  if (screenState === 'game') {
    startGame();
  } else {
    showHome();
  }

  // Start music when the page loads
  backgroundMusic.play();

  startButton.addEventListener('click', () => {
    // Stop music when the start button is clicked
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Optionally reset the song to the beginning
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('backgroundMusic');
  const gameMusic = document.getElementById('gameMusic');
  const startButton = document.getElementById('startButton');

  // Ensure background music starts playing
  function playBackgroundMusic() {
    backgroundMusic.play().catch(error => {
      // Handle autoplay policy restrictions
      console.log('Autoplay blocked, please interact with the page to start music');
    });
  }

  // Play background music on page load
  playBackgroundMusic();

  startButton.addEventListener('click', () => {
    // Stop background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    // Play game music
    gameMusic.play();
  });
});



homeButton.addEventListener('click', showHome);
startButton.addEventListener('click', startGame);


document.getElementById('startButton').addEventListener('click', () => {
  document.getElementById('gameContent').style.display = 'block'; // Show game content
  document.getElementById('startButton').style.display = 'none';  // Hide the Start button
  shuffleCards(); // Optionally shuffle the cards when the game starts
});





function saveHighScore() {
  localStorage.setItem('highScore', highScore); //setting high score to local storage
}
function loadHighScore() {
  const savedHighScore = localStorage.getItem('highScore');
  if (savedHighScore) {
    highScore = parseInt(savedHighScore, 10);
  }
}

function saveGameState() {
  const gameState = {
    shuffledCards: shuffledCards, // Save the shuffled deck
    flippedCards: Array.from(document.querySelectorAll('.flipped')).map(card => card.className), // Save flipped cards
    firstCard: firstCard ? firstCard.className : null, // Store first card class name if a card is flipped
    totalScore: totalScore, // Save the total score
    highScore: highScore // Save the high score
  };
  localStorage.setItem('memoryGame', JSON.stringify(gameState));
}



const cardScores = {
  "alakazam": 10,
  "mimikyu": 10,
  "rayquaza": 60, // Higher score for Rayquaza
  "squirtle": 10,
  "bulbasaur": 10,
  "gengar": 10,
  "eevee": 10,
  "mewtwo": 40, // Higher score for Mewtwo
  "charizard": 100, // Highest score for Charizard bc hes the GOAT
  "pikachu": 10
};



const Pokemon = [
  "alakazam",
  "mimikyu",
  "rayquaza",
  "squirtle",
  "bulbasaur",
  "gengar",
  "eevee",
  "mewtwo",
  "charizard",
  "pikachu"
];

function shuffleCards() {
  shuffledCards = shuffle([...Pokemon, ...Pokemon]); // Shuffle the deck
  gameContainer.innerHTML = ''; // Clear existing cards
  createDivsForCards(shuffledCards); // Create new card elements
  totalScore = 0; // Reset score
  updateScoreDisplay();
}

let shuffledCards = shuffle([...Pokemon, ...Pokemon]);  // Two of each Pokémon

function loadGameState() {
  const savedGame = localStorage.getItem('memoryGame');
  if (savedGame) {
    const gameState = JSON.parse(savedGame);

    // Load the shuffled cards
    shuffledCards = gameState.shuffledCards;
    gameContainer.innerHTML = ''; // Clear existing cards
    createDivsForCards(shuffledCards); // Create the card elements

    // Restore flipped cards
    gameState.flippedCards.forEach(className => {
      const flippedCard = document.querySelector(`.${className}`);
      if (flippedCard) {
        flippedCard.classList.add('flipped');
        flippedCard.removeEventListener('click', handleCardClick); // Disable further clicks
      }
    });

    // Restore firstCard if applicable
    if (gameState.firstCard) {
      firstCard = document.querySelector(`.${gameState.firstCard}`);
      if (firstCard) {
        firstCard.classList.add('flipped');
      }
    }

    // Restore scores
    totalScore = gameState.totalScore;
    highScore = gameState.highScore;

    updateScoreDisplay();
  } else {
    // Start a new game if no saved state is found
    shuffleCards();
  }
}





// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let card = array[counter];
    array[counter] = array[index];
    array[index] = card;
     
  }

  return array;
}


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForCards(pokeArray) {
  pokeArray.forEach(card=> {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(card);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  })

}

// TODO: Implement this function!
function handleCardClick(event) {

  if (lockBoard) return; // stops clicks when board is locked 
  const clickedCard = event.target;
  if (clickedCard===firstCard) return; //do nothing if they click the same card
  clickedCard.classList.add ("flipped") //flipping card by adding a class
  if(!firstCard){
    firstCard = clickedCard;
  }
  else{
    secondCard = clickedCard;
    lockBoard = true;
    checkForMatch();
  }
  // you can use event.target to see which element was clicked
}

function checkForMatch() {
  const getBaseClassName = (card) => card.className.split(' ')[0];
  const firstCardBaseName = getBaseClassName(firstCard);
  const secondCardBaseName = getBaseClassName(secondCard);
  const isMatch = firstCardBaseName === secondCardBaseName;
  const firstCardScore = cardScores[firstCardBaseName] || 0;
  const secondCardScore = cardScores[secondCardBaseName] || 0;

  if (isMatch) {
    totalScore += firstCardScore + secondCardScore;
    updateScoreDisplay();
    if (totalScore > highScore) {
      highScore = totalScore;
      saveHighScore(); // Save high score if new high score achieved
      updateScoreDisplay();
    }
    disableCards();
  } else {
    totalScore -= 5; // Penalty for incorrect match
    setTimeout(() => {
      unFlippedCards();
      updateScoreDisplay();
    }, 1000);
  }
}


function disableCards(){
  firstCard.removeEventListener('click', handleCardClick);
  secondCard.removeEventListener('click', handleCardClick);
  saveGameState(); //saving when cards match
  resetBoard(); // reset for next pair 
}

function unFlippedCards(){
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");

  resetBoard(); // Reset board after unflipping
}

function resetBoard() {
  firstCard = null
  secondCard = null
  lockBoard = false
}
// when the DOM loads

function clearGameState() {
  localStorage.removeItem('memoryGame');
}
function updateScoreDisplay() {
  if (scoreElement) { // Check if scoreElement exists
    scoreElement.textContent = `Score: ${totalScore} | High Score: ${highScore}`;
  } 
}

document.getElementById('shuffleButton').addEventListener('click', shuffleCards );


