// Get references to the HTML elements we need to interact with
const wordDisplay = document.getElementById('word-display');
const imageDisplay = document.getElementById('image-display');
const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status-text');
const challengeArea = document.getElementById('challenge-area');
const animationArea = document.getElementById('animation-area');
const animationGif = document.getElementById('animation-gif');

// Define your list of words, images, and animations.
// IMPORTANT: Make sure the file paths match your file names exactly!
const wordList = [
    { word: 'cat', image: 'images/cat.png', animation: 'animations/cat.gif' },
    { word: 'dog', image: 'images/dog.png', animation: 'animations/dog.gif' },
    { word: 'sun', image: 'images/sun.png', animation: 'animations/sun.gif' },
    { word: 'ball', image: 'images/ball.png', animation: 'animations/ball.gif' },
    { word: 'car', image: 'images/car.png', animation: 'animations/car.gif' }
];

// A variable to track which word we are on
let currentWordIndex = 0;

// Set up the browser's Speech Recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
} else {
    statusText.textContent = "Sorry, your browser doesn't support speech recognition.";
    micButton.disabled = true;
}

// Function to display the next word challenge
function showNextWord() {
    animationArea.classList.add('hidden'); // Hide the animation
    challengeArea.classList.remove('hidden'); // Show the challenge

    const currentWordData = wordList[currentWordIndex];
    wordDisplay.textContent = currentWordData.word;
    imageDisplay.src = currentWordData.image;
    statusText.textContent = 'Click the mic and say the word!';
}

// Function to run when the user gets the answer right
function onCorrectAnswer() {
    statusText.textContent = 'Awesome!';
    
    // Show the success animation
    const currentWordData = wordList[currentWordIndex];
    animationGif.src = currentWordData.animation;
    challengeArea.classList.add('hidden');
    animationArea.classList.remove('hidden');

    // Go to the next word after 3 seconds
    currentWordIndex = (currentWordIndex + 1) % wordList.length; // Loop back to the start
    setTimeout(showNextWord, 3000); 
}

// Add a click event to the microphone button
micButton.addEventListener('click', () => {
    statusText.textContent = 'Listening...';
    try {
        recognition.start(); // Start listening
    } catch(error) {
        console.error("Recognition already started.", error);
    }
});

// Process the result from the speech recognition
recognition.onresult = (event) => {
    // Get the transcript of what was said
    const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
    const correctWord = wordList[currentWordIndex].word;
    
    statusText.textContent = `You said: "${spokenWord}"`;

    // Check if the answer is correct
    if (spokenWord === correctWord) {
        setTimeout(onCorrectAnswer, 1000); // Wait a second before celebrating
    } else {
        setTimeout(() => {
            statusText.textContent = 'So close, try again!';
        }, 1000);
    }
};

// Handle any errors
recognition.onerror = (event) => {
    statusText.textContent = 'Oops, I didn\'t catch that. Please try again.';
    console.error('Speech recognition error:', event.error);
};

// Start the game by showing the first word
showNextWord();