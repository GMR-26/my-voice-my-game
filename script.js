// --- 1. GET HTML ELEMENTS ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const playButton = document.getElementById('play-button');
const finalCelebrationScreen = document.getElementById('final-celebration-screen');
const quoteDisplay = document.getElementById('quote-display');
const playAgainButton = document.getElementById('play-again-button');

const wordDisplay = document.getElementById('word-display');
const imageDisplay = document.getElementById('image-display');
const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status-text');
const challengeArea = document.getElementById('challenge-area');
const animationArea = document.getElementById('animation-area');
const animationGif = document.getElementById('animation-gif');
const nextButton = document.getElementById('next-button');

const celebrationSound = new Audio('sounds/success.mp3');
const finalCelebrationSound = new Audio('sounds/final-success.mp3');

// --- 2. DEFINE YOUR WORDS & ASSETS ---
const wordList = [
    { word: 'cat', image: 'images/cat.png', animation: 'animations/cat.gif' },
    { word: 'dog', image: 'images/dog.png', animation: 'animations/dog.gif' },
    { word: 'sun', image: 'images/sun.png', animation: 'animations/sun.gif' },
    { word: 'ball', image: 'images/ball.png', animation: 'animations/ball.gif' },
    { word: 'car', image: 'images/car.png', animation: 'animations/car.gif' }
];

const quotes = [
    "The journey of a thousand miles begins with a single step.",
    "Believe you can and you're halfway there.",
    "Every voice deserves to be heard.",
    "You are capable of amazing things.",
    "Practice makes progress, not perfect."
];

// --- 3. GAME STATE ---
let currentWordIndex = 0;

// --- 4. SPEECH RECOGNITION SETUP ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
} else {
    const playButtonContainer = playButton.parentElement;
    const errorText = document.createElement('p');
    errorText.textContent = "Sorry, your browser doesn't support Speech Recognition.";
    errorText.style.color = 'red';
    playButtonContainer.appendChild(errorText);
    playButton.disabled = true;
}

// --- 5. UI STATE & GAME LOGIC FUNCTIONS ---

// Resets the UI to show the word/image challenge
function showChallengeView() {
    challengeArea.classList.remove('hidden');
    animationArea.classList.add('hidden');
    micButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    statusText.classList.remove('hidden');
}

// Shows the success animation for a single word
function showSuccessState() {
    // Check if it's the last word in the list
    if (currentWordIndex === wordList.length - 1) {
        showFinalCelebration();
    } else {
        celebrationSound.play();
        challengeArea.classList.add('hidden');
        micButton.classList.add('hidden');
        animationArea.classList.remove('hidden');
        nextButton.classList.remove('hidden');
        statusText.textContent = 'Awesome!';
    }
}

// Shows the final "You Did It!" screen
function showFinalCelebration() {
    finalCelebrationSound.play();
    gameScreen.classList.add('hidden'); // Hide the main game screen
    finalCelebrationScreen.classList.remove('hidden'); // Show the celebration screen

    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.textContent = `"${randomQuote}"`;
}

// Loads the data for the current word into the UI
function loadNextWord() {
    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    animationGif.src = currentWordData.animation;
    showChallengeView(); // Display the challenge view with the new word
}

// --- 6. EVENT LISTENERS ---

// Listener for the main "Play" button on the start screen
playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadNextWord();
});

// Listener to start listening when the mic is clicked
micButton.addEventListener('click', () => {
    micButton.classList.add('is-listening');
    micButton.disabled = true;
    statusText.textContent = 'Listening...';
    recognition.start();
});

// Listener for the "Next Word" button after a successful answer
nextButton.addEventListener('click', () => {
    currentWordIndex++;
    loadNextWord();
});

// Listener for the "Play Again" button on the final celebration screen
playAgainButton.addEventListener('click', () => {
    finalCelebrationScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    currentWordIndex = 0; // Reset the game to the first word
    loadNextWord();
});

// Process the result from speech recognition
recognition.onresult = (event) => {
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim().replace(/[\.,?!]/g, '');
    const correctWord = wordList[currentWordIndex].word;

    if (spokenWord.includes(correctWord)) {
        statusText.textContent = `You said: "${spokenWord}"... Perfect!`;
        setTimeout(showSuccessState, 500);
    } else {
        statusText.textContent = `I heard "${spokenWord}". So close, try again!`;
    }
};

// This event runs when recognition ends, whether there was a result or not
recognition.onend = () => {
    micButton.classList.remove('is-listening');
    micButton.disabled = false;
};

// Handle any errors during speech recognition
recognition.onerror = (event) => {
    statusText.textContent = 'Oops, I didn\'t catch that. Please try again.';
    console.error('Speech recognition error:', event.error);
};