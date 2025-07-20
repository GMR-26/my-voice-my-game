// --- 1. GET HTML ELEMENTS ---
// NEW: Get the new screen containers and the play button
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const playButton = document.getElementById('play-button');

// Existing elements
const wordDisplay = document.getElementById('word-display');
const imageDisplay = document.getElementById('image-display');
const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status-text');
const challengeArea = document.getElementById('challenge-area');
const animationArea = document.getElementById('animation-area');
const animationGif = document.getElementById('animation-gif');
const nextButton = document.getElementById('next-button');
const celebrationSound = new Audio('sounds/success.mp3');


// --- 2. DEFINE YOUR WORDS & ASSETS ---
const wordList = [
    { word: 'cat', image: 'images/cat.png', animation: 'animations/cat.gif' },
    { word: 'dog', image: 'images/dog.png', animation: 'animations/dog.gif' },
    { word: 'sun', image: 'images/sun.png', animation: 'animations/sun.gif' },
    { word: 'ball', image: 'images/ball.png', animation: 'animations/ball.gif' },
    { word: 'car', image: 'images/car.png', animation: 'animations/car.gif' }
];


// --- 3. GAME STATE ---
let currentWordIndex = 0;


// --- 4. SPEECH RECOGNITION SETUP ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
} else {
    // This message will now appear on the start screen if not supported
    const playButtonContainer = playButton.parentElement;
    const errorText = document.createElement('p');
    errorText.textContent = "Sorry, your browser doesn't support Speech Recognition.";
    errorText.style.color = 'red';
    playButtonContainer.appendChild(errorText);
    playButton.disabled = true;
}


// --- 5. GAME FUNCTIONS ---
function showNextWord() {
    animationArea.classList.add('hidden');
    challengeArea.classList.remove('hidden');
    micButton.classList.remove('hidden');
    nextButton.classList.add('hidden'); 

    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    statusText.textContent = 'Click the mic and say the word!';
}

function onCorrectAnswer() {
    statusText.textContent = 'Great Job!';
    celebrationSound.play();

    const currentWordData = wordList[currentWordIndex];
    animationGif.src = currentWordData.animation;
    challengeArea.classList.add('hidden');
    micButton.classList.add('hidden');
    animationArea.classList.remove('hidden');
    nextButton.classList.remove('hidden');
}


// --- 6. EVENT LISTENERS ---

// NEW: Listener for the main Play button on the start screen
playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    showNextWord(); // Initialize the first word of the game
});

// Listener for the microphone button
micButton.addEventListener('click', () => {
    statusText.textContent = 'Listening...';
    recognition.start();
});

// Listener for our 'Next Word' button
nextButton.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex + 1) % wordList.length;
    showNextWord();
});

// Process the result from the speech recognition
recognition.onresult = (event) => {
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    const correctWord = wordList[currentWordIndex].word;
    
    statusText.textContent = `You said: "${spokenWord}"`;

    if (spokenWord === correctWord) {
        setTimeout(onCorrectAnswer, 1000);
    } else {
        setTimeout(() => {
            statusText.textContent = 'So close, try again!';
        }, 1000);
    }
};

// Handle errors
recognition.onerror = (event) => {
    statusText.textContent = 'Oops, I didn\'t catch that. Please try again.';
    console.error('Speech recognition error:', event.error);
};


// --- 7. INITIALIZE THE GAME ---
// DELETED: We no longer call showNextWord() here. It's called when the user clicks "Play".