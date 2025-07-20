// --- 1. GET HTML ELEMENTS ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const playButton = document.getElementById('play-button');

const wordDisplay = document.getElementById('word-display');
const imageDisplay = document.getElementById('image-display');
const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status-text');
const challengeArea = document.getElementById('challenge-area');
const animationArea = document.getElementById('animation-area');
const animationGif = document.getElementById('animation-gif');
const nextButton = document.getElementById('next-button');
const celebrationSound = new Audio('sounds/success.mp3');
const listeningArea = document.getElementById('listening-area'); // NEW: Get listening area

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
    const playButtonContainer = playButton.parentElement;
    const errorText = document.createElement('p');
    errorText.textContent = "Sorry, your browser doesn't support Speech Recognition.";
    errorText.style.color = 'red';
    playButtonContainer.appendChild(errorText);
    playButton.disabled = true;
}

// --- 5. GAME FUNCTIONS ---

// This function sets up the screen for a new word challenge
function showNextWord() {
    challengeArea.classList.remove('hidden'); // Show challenge
    listeningArea.classList.add('hidden');    // Hide listening UI
    animationArea.classList.add('hidden');    // Hide animation
    micButton.classList.remove('hidden');     // Show mic button
    nextButton.classList.add('hidden');       // Hide next button
    statusText.classList.remove('hidden');    // Show status text

    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    statusText.textContent = 'Click the mic and say the word!';
}

// This function shows the success animation
function onCorrectAnswer() {
    celebrationSound.play();
    challengeArea.classList.add('hidden');
    listeningArea.classList.add('hidden');
    animationArea.classList.remove('hidden'); // Show animation
    micButton.classList.add('hidden');
    nextButton.classList.remove('hidden');    // Show next button
    statusText.classList.add('hidden');       // Hide status text
}

// This function shows the listening UI
function startListening() {
    challengeArea.classList.add('hidden');    // Hide challenge
    listeningArea.classList.remove('hidden'); // Show listening UI
    micButton.classList.add('hidden');        // Hide mic button
    statusText.classList.add('hidden');       // Hide status text
    
    recognition.start(); // Start listening
}

// --- 6. EVENT LISTENERS ---

playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    showNextWord();
});

micButton.addEventListener('click', startListening);

nextButton.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex + 1) % wordList.length;
    showNextWord();
});

// Process the result
recognition.onresult = (event) => {
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    const correctWord = wordList[currentWordIndex].word;
    
    showNextWord(); // Go back to the main challenge view first
    statusText.textContent = `You said: "${spokenWord}"`;

    if (spokenWord === correctWord) {
        setTimeout(onCorrectAnswer, 500); // Short delay before celebrating
    } else {
        setTimeout(() => {
            statusText.textContent = 'So close, try again!';
        }, 500);
    }
};

// Handle errors
recognition.onerror = (event) => {
    showNextWord(); // Go back to the main challenge view on error too
    statusText.textContent = 'Oops, I didn\'t catch that. Please try again.';
    console.error('Speech recognition error:', event.error);
};