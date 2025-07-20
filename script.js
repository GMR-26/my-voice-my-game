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

// --- 2. DEFINE YOUR WORDS & ASSETS ---
// !!! DOUBLE-CHECK THESE FILE PATHS !!!
// This is the most likely source of the broken animation error.
// Make sure 'animations/cat.gif' exactly matches your file name and folder.
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
    // ... (rest of setup is the same)
} else {
    // ... (error handling is the same)
}

// --- 5. GAME LOGIC ---

// This function shows the success state
function showSuccessState() {
    celebrationSound.play();
    challengeArea.classList.add('hidden');    // Hide the word/image
    micButton.classList.add('hidden');        // Hide the mic button
    animationArea.classList.remove('hidden'); // Show the success animation
    nextButton.classList.remove('hidden');    // Show the next button
    statusText.textContent = 'Awesome!';
}

// This function loads the data for the next word and resets the UI
function loadNextWord() {
    // Set up the UI for a new challenge
    challengeArea.classList.remove('hidden');
    animationArea.classList.add('hidden');
    micButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    
    // Load the word data
    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    // Set the animation source ready for when it's needed
    animationGif.src = currentWordData.animation; 
    
    statusText.textContent = 'Click the mic and say the word!';
}

// --- 6. EVENT LISTENERS ---

playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadNextWord();
});

micButton.addEventListener('click', () => {
    // Show listening state
    micButton.classList.add('is-listening');
    micButton.disabled = true; // Prevent multiple clicks
    statusText.textContent = 'Listening...';
    
    recognition.start();
});

nextButton.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex + 1) % wordList.length;
    loadNextWord();
});

// Process the result
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

// This event runs when recognition ends, whether it was successful or not
recognition.onend = () => {
    // Stop the listening animation and re-enable the button
    micButton.classList.remove('is-listening');
    micButton.disabled = false;
};