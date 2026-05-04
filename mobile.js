const mobileInput = document.getElementById('mobileInput');
const gameArea = document.getElementById('game');

// Detect Mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    const focusMsg = document.getElementById('focus-error');
    if (focusMsg) focusMsg.innerText = "Tap to Type";

    // This is the "Aggressive Focus" handler
    const triggerKeyboard = (e) => {
        // Don't trigger if they clicked a button or settings
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;

        // Force the input to be focused
        mobileInput.focus();
        
        // Some browsers need a second tiny push
        setTimeout(() => {
            mobileInput.focus();
            mobileInput.click();
        }, 10);
    };

    // Listen for both touch and click
    gameArea.addEventListener('mousedown', triggerKeyboard);
    gameArea.addEventListener('touchstart', triggerKeyboard);

    // Handle Input
    mobileInput.addEventListener('input', (e) => {
        const char = e.data;
        
        if (char) {
            gameArea.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
        } else if (e.inputType === 'deleteContentBackward') {
            gameArea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
        }
        
        mobileInput.value = '';
    });

    // Spacebar Fix
    mobileInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            gameArea.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
            mobileInput.value = '';
        }
    });
}