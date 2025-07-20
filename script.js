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
const listeningArea = document.getElementById('listening-area');
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

// --- 5. UI STATE FUNCTIONS ---

function showChallengeView() {
    challengeArea.classList.remove('hidden');
    listeningArea.classList.add('hidden');
    animationArea.classList.add('hidden');
    micButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    statusText.classList.remove('hidden');
}

function showSuccessView() {
    celebrationSound.play();
    challengeArea.classList.add('hidden');
    listeningArea.classList.add('hidden');
    animationArea.classList.remove('hidden');
    micButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
    statusText.classList.add('hidden');
}

function showListeningView() {
    challengeArea.classList.add('hidden');
    listeningArea.classList.remove('hidden');
    micButton.classList.add('hidden');
    statusText.classList.add('hidden');
    recognition.start();
}

function loadNextWord() {
    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    statusText.textContent = 'Click the mic and say the word!';
    showChallengeView();
}


// --- 6. EVENT LISTENERS ---

playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadNextWord();
});

micButton.addEventListener('click', showListeningView);

nextButton.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex + 1) % wordList.length;
    loadNextWord();
});

// #### THIS IS THE UPDATED SECTION ####
// Process the result from speech recognition
recognition.onresult = (event) => {
    showChallengeView(); // Return to the main view to show the result

    // Get the transcript and clean it up thoroughly
    let spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    // NEW: Remove common punctuation to make matching more reliable
    spokenWord = spokenWord.replace(/[\.,?!]/g, '');

    const correctWord = wordList[currentWordIndex].word;
    
    // UPDATED: Check if the SPOKEN phrase INCLUDES the correct word.
    // This is more flexible than an exact match (spokenWord === correctWord).
    if (spokenWord.includes(correctWord)) {
        statusText.textContent = `You said: "${spokenWord}"... Perfect!`;
        setTimeout(showSuccessView, 500); // Celebrate after a short delay
    } else {
        // UPDATED: Give the user better feedback on failure
        // Show them what the computer heard so they know why it failed.
        statusText.textContent = `I heard "${spokenWord}". So close, try again!`;
    }
};

// Handle errors during speech recognition
recognition.onerror = (event) => {
    showChallengeView(); 
    statusText.textContent = 'Oops, I didn\'t catch that. Please try again.';
    console.error('Speech recognition error:', event.error);
};