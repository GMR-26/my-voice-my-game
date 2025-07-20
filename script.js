// --- 1. GET HTML ELEMENTS ---
// Get references to all the interactive parts of your HTML
const wordDisplay = document.getElementById('word-display');
const imageDisplay = document.getElementById('image-display');
const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status-text');
const challengeArea = document.getElementById('challenge-area');
const animationArea = document.getElementById('animation-area');
const animationGif = document.getElementById('animation-gif');
const nextButton = document.getElementById('next-button'); // NEW: Get the next button

// NEW: Create an Audio object for our celebration sound
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
    statusText.textContent = "Sorry, your browser doesn't support speech recognition.";
    micButton.disabled = true;
}


// --- 5. GAME FUNCTIONS ---

// UPDATED: This function now also hides the 'Next' button
function showNextWord() {
    animationArea.classList.add('hidden');
    challengeArea.classList.remove('hidden');
    micButton.classList.remove('hidden');
    nextButton.classList.add('hidden'); // NEW: Hide the next button

    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    statusText.textContent = 'Click the mic and say the word!';
}

// UPDATED: This function no longer uses setTimeout to go to the next word
function onCorrectAnswer() {
    statusText.textContent = 'Great Job!';
    celebrationSound.play(); // NEW: Play the celebration sound

    // Show the success animation and the next button
    const currentWordData = wordList[currentWordIndex];
    animationGif.src = currentWordData.animation;
    challengeArea.classList.add('hidden');
    micButton.classList.add('hidden'); // NEW: Hide the mic button
    animationArea.classList.remove('hidden');
    nextButton.classList.remove('hidden'); // NEW: Show the next button
}


// --- 6. EVENT LISTENERS ---

// Listener for the microphone button
micButton.addEventListener('click', () => {
    statusText.textContent = 'Listening...';
    recognition.start();
});

// NEW: Add a listener for our new 'Next Word' button
nextButton.addEventListener('click', () => {
    // Move to the next word in the list
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
showNextWord();