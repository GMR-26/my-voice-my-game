# My Voice, My Game

**🔴 Live Game Link:** https://my-voice-my-game.vercel.app/

## 1. Project Overview & Goal
"My Voice, My Game" is an interactive web experience designed to make speech practice fun and rewarding for children with speech therapy needs, autism, or delayed speech. My goal was to create a positive feedback loop where speaking correctly results in an immediate, fun animation, encouraging continued engagement in a frustration-free environment.

## 2. Design Thinking & User-Centered Approach
The design process was centered on the end user: a child who may find traditional speech practice challenging.

* **Simplicity:** The interface is minimal, with one large, clear button and a single focus area. This reduces cognitive load and makes interaction intuitive.
* **Positive Reinforcement:** I intentionally avoided negative feedback. If a word is incorrect, the app gently prompts "Try again!". A correct word is celebrated with a fun, full-screen animation, creating a powerful sense of accomplishment.
* **Accessibility:** The core interaction is voice, making it accessible to children who may have motor impairments. The UI uses large, high-contrast text and simple, recognizable imagery.
* **Frustration-Free:** There are no timers, scores, or failure states. The child can take as much time as they need, creating a safe and encouraging space for practice.

## 3. Technology Stack
* **Frontend:** HTML5, CSS3, and modern JavaScript (ES6).
* **Speech Recognition:** The native browser Web Speech API (`SpeechRecognition`) was used for real-time, in-browser voice processing without needing external services.
* **Hosting:** Deployed on Vercel for fast, global access and easy integration with GitHub.
* **Version Control:** Git & GitHub.