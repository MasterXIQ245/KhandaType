@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Mono&display=swap');

:root {
    --bgColor: #323437;
    --textPrimary: #d1d0c5;
    --textSecondary: #646669;
    --primaryColor: #e2b714;
    --errorColor: #ca4754;
}

body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--bgColor);
    color: var(--textPrimary);
    margin: 0;
    transition: background 0.3s, color 0.3s;
    overflow-x: hidden;
    /* Prevent bouncing on mobile */
    overscroll-behavior: none;
}

main {
    width: 90%;
    max-width: 900px;
    margin: 40px auto;
}

h1 {
    color: var(--primaryColor);
    font-size: 2.5rem;
    margin-bottom: 20px;
}

#live-stats {
    display: flex;
    gap: 25px;
    font-family: 'Roboto Mono', monospace;
    color: var(--textSecondary);
    margin-bottom: 10px;
}

#header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

#info {
    color: var(--primaryColor);
    font-family: 'Roboto Mono', monospace;
    font-size: 2.5rem;
}

#nav-buttons { display: flex; gap: 10px; }

button {
    background: transparent;
    border: 1px solid var(--textSecondary);
    color: var(--textSecondary);
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Roboto Mono', monospace;
}

#game {
    line-height: 1.5;
    height: 140px;
    overflow: hidden;
    position: relative; 
    outline: none;
    font-size: 1.5rem;
}

#words {
    color: var(--textSecondary);
    transition: margin-top 0.25s ease;
}

.word {
    display: inline-block;
    margin: 0 8px;
    font-family: 'Roboto Mono', monospace;
}

.letter.correct { color: var(--textPrimary); }
.letter.incorrect { color: var(--errorColor); }

#cursor {
    width: 2px;
    height: 1.5rem;
    background: var(--primaryColor);
    position: absolute;
    display: none;
    animation: blink 1s infinite;
}

#game:focus #cursor { display: block; }

@keyframes blink { 50% { opacity: 0; } }

#focus-error {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(50, 52, 55, 0.95);
    color: var(--primaryColor);
    z-index: 100;
    font-family: 'Roboto Mono', monospace;
}

#game:focus #focus-error { display: none; }

/* Modal */
.modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 2000;
    align-items: center;
    justify-content: center;
}
.modal.active { display: flex; }
.modal-content {
    background: var(--bgColor);
    padding: 20px;
    border: 1px solid var(--textSecondary);
    width: 90%;
    max-width: 400px;
    border-radius: 8px;
}

/* --- Mobile Specifics --- */
@media screen and (max-width: 768px) {
    main { margin-top: 20px; }
    h1 { font-size: 1.8rem; }
    #game { font-size: 1.2rem; height: 120px; }
    #info { font-size: 1.8rem; }
    
    /* Ensure the game area is visible above the keyboard */
    body { padding-bottom: 50vh; }
}

/* Themes */
body.cyberpunk { --bgColor: #000; --primaryColor: #0f0; --textPrimary: #0f0; --textSecondary: #040; }
body.lavender { --bgColor: #2e1a47; --primaryColor: #be95ff; --textPrimary: #be95ff; --textSecondary: #5a4282; }
body.monokai { --bgColor: #272822; --primaryColor: #f92672; --textPrimary: #f8f8f2; --textSecondary: #75715e; }