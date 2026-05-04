// --- 1. Game Configuration & State ---
let gameTime = 30000; 
let settings = { 
    theme: 'default', 
    type: 'words', 
    suddenDeath: false, 
    master: false, 
    noBackspace: false, 
    volume: 0.5 
};

const wordBanks = {
    words: 'the quick brown fox jumps over the lazy dog in one good real state high life consider point want while public interest increase think small another child system problem work house part group follow system world high school fact interest head hand eye line end mean old great same'.split(' '),
    code: 'function const return let document.getElementById console.log while async await import export try catch array.forEach map filter reduce switch case default window.localStorage'.split(' '),
    numbers: '123 456 789 0 !@# $%^ &*() _+ [] {} | ;: ,.<> ? "quote" 2026 100% (parenthesis)'.split(' ')
};

let stats = { wpm: 0, acc: 100, errors: 0, typed: 0, correct: 0, missedKeys: {} };
let timer = null;
let gameActive = false;
let statsTrack = [];

// --- 2. Audio Setup ---
const clickSnd = new Audio('click.mp3');
const errorSnd = new Audio('error.mp3');

function playSound(isCorrect) {
    const s = isCorrect ? clickSnd : errorSnd;
    s.volume = settings.volume;
    s.currentTime = 0;
    s.play().catch(() => {}); 
}

// --- 3. Core Logic Functions ---

function updateLiveStats() {
    if (!window.gameStart) return { wpm: 0, acc: 100 };
    const elapsed = (Date.now() - window.gameStart) / 1000 / 60;
    const wpm = elapsed > 0 ? Math.round((stats.correct / 5) / elapsed) : 0;
    const acc = stats.typed > 0 ? Math.round((stats.correct / stats.typed) * 100) : 100;
    
    document.getElementById('live-wpm').innerText = `wpm: ${wpm}`;
    document.getElementById('live-acc').innerText = `acc: ${acc}%`;
    return { wpm, acc };
}

function updateCursor() {
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    const game = document.getElementById('game');
    
    if (!nextLetter && !nextWord) return;

    const gameRect = game.getBoundingClientRect();
    const targetRect = (nextLetter || nextWord).getBoundingClientRect();

    cursor.style.top = (targetRect.top - gameRect.top + 5) + 'px';
    cursor.style.left = (nextLetter ? targetRect.left - gameRect.left : targetRect.right - gameRect.left) + 'px';
}

function newGame() {
    clearInterval(timer);
    timer = null;
    gameActive = true;
    window.gameStart = null;
    stats = { wpm: 0, acc: 100, errors: 0, typed: 0, correct: 0, missedKeys: {} };
    statsTrack = [];

    const wordContainer = document.getElementById('words');
    wordContainer.style.marginTop = '0px';
    wordContainer.innerHTML = '';
    document.getElementById('game').classList.remove('master-blur');
    document.getElementById('info').innerText = gameTime / 1000;

    const bank = wordBanks[settings.type] || wordBanks.words;
    for (let i = 0; i < 150; i++) {
        const w = bank[Math.floor(Math.random() * bank.length)];
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.innerHTML = w.split('').map(l => `<span class="letter">${l}</span>`).join('');
        wordContainer.appendChild(wordDiv);
    }

    const firstWord = document.querySelector('.word');
    const firstLetter = document.querySelector('.letter');
    if(firstWord) firstWord.classList.add('current');
    if(firstLetter) firstLetter.classList.add('current');
    
    document.getElementById('game').focus();
    setTimeout(updateCursor, 10);
}

function gameOver() {
    gameActive = false;
    clearInterval(timer);
    const final = updateLiveStats();
    
    localStorage.setItem('lastGameData', JSON.stringify(statsTrack));
    localStorage.setItem('lastWpm', final.wpm);
    localStorage.setItem('lastAcc', final.acc);
    localStorage.setItem('missedKeys', JSON.stringify(stats.missedKeys));
    
    window.location.href = 'graph.html';
}

// --- 4. Event Listeners ---

document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key;
    
    // Always allow Tab for restart
    if (key === 'Tab') { 
        ev.preventDefault(); 
        newGame(); 
        return; 
    } 

    if (!gameActive) return;

    const currentWord = document.querySelector('.word.current');
    let currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerText || ' ';

    // Start Timer on first keypress
    if (!timer && key.length === 1) {
        window.gameStart = Date.now();
        timer = setInterval(() => {
            const passed = Date.now() - window.gameStart;
            const left = Math.ceil((gameTime - passed) / 1000);
            if (left <= 0) { gameOver(); return; }
            document.getElementById('info').innerText = left;
            const cur = updateLiveStats();
            statsTrack.push({ second: Math.floor(passed / 1000), wpm: cur.wpm });
        }, 1000);
    }

    // Handle Normal Character Typing
    if (key.length === 1 && key !== ' ') {
        stats.typed++;
        const isCorrect = key === expected;
        
        if (isCorrect) {
            stats.correct++;
            playSound(true);
            if (settings.master) document.getElementById('game').classList.remove('master-blur');
            currentLetter.classList.add('correct');
        } else {
            stats.errors++;
            playSound(false);
            stats.missedKeys[expected] = (stats.missedKeys[expected] || 0) + 1;
            if (settings.suddenDeath) { gameOver(); return; }
            if (settings.master) document.getElementById('game').classList.add('master-blur');
            currentLetter.classList.add('incorrect');
        }

        currentLetter.classList.remove('current');
        if (currentLetter.nextSibling) {
            currentLetter.nextSibling.classList.add('current');
        }
    } 

    // Handle Spacebar (Moving to next word)
    else if (key === ' ') {
        ev.preventDefault(); // Prevent page scrolling
        
        // Mark all remaining letters in the current word as incorrect
        const remainingLetters = currentWord.querySelectorAll('.letter:not(.correct):not(.incorrect)');
        remainingLetters.forEach(l => {
            l.classList.add('incorrect');
            stats.typed++; // Count skipped letters toward accuracy
        });

        if (currentWord.nextSibling) {
            currentWord.classList.remove('current');
            if (currentLetter) currentLetter.classList.remove('current');
            
            const nextWord = currentWord.nextSibling;
            nextWord.classList.add('current');
            if (nextWord.firstChild) nextWord.firstChild.classList.add('current');

            // Scroll Logic
            const wordRect = nextWord.getBoundingClientRect();
            const gameRect = document.getElementById('game').getBoundingClientRect();
            if (wordRect.bottom > gameRect.bottom - 10) {
                const div = document.getElementById('words');
                const currentMargin = parseInt(div.style.marginTop || 0);
                div.style.marginTop = (currentMargin - 45) + 'px';
            }
        }
    }

    // Handle Backspace
    else if (key === 'Backspace' && !settings.noBackspace) {
        const letters = Array.from(currentWord.querySelectorAll('.letter'));
        const index = letters.indexOf(currentLetter);

        if (index > 0 || (currentLetter === null && letters.length > 0)) {
            if (currentLetter) {
                // Moving back from middle of word
                const prev = currentLetter.previousSibling;
                currentLetter.classList.remove('current');
                prev.classList.remove('correct', 'incorrect');
                prev.classList.add('current');
            } else {
                // Moving back from the very end of a word
                const last = letters[letters.length - 1];
                last.classList.remove('correct', 'incorrect');
                last.classList.add('current');
            }
        }
    }

    updateCursor();
    updateLiveStats();
});

// --- 5. UI Controls ---
const modal = document.getElementById('settingsModal');

document.getElementById('newGameBtn').onclick = () => newGame();

document.getElementById('settingsBtn').onclick = () => {
    modal.classList.add('active');
};

document.getElementById('saveSettings').onclick = () => {
    settings.theme = document.getElementById('setTheme').value;
    settings.type = document.getElementById('setType').value;
    settings.suddenDeath = document.getElementById('setSuddenDeath').checked;
    settings.master = document.getElementById('setMaster').checked;
    settings.noBackspace = document.getElementById('setNoBackspace').checked;
    settings.volume = parseFloat(document.getElementById('setVol').value);
    
    gameTime = parseInt(document.getElementById('setTime').value) * 1000;
    
    document.body.className = settings.theme === 'default' ? '' : settings.theme;
    modal.classList.remove('active');
    newGame();
};

// Start the first game
newGame();