/**
 * mobile.js - Seamless Virtual Keyboard Integration
 */
const mobileInput = document.getElementById('mobileInput');
const gameArea = document.getElementById('game');

// Detect if user is on a mobile device
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobileDevice) {
    // 1. Update UI for mobile
    const focusMsg = document.getElementById('focus-error');
    if (focusMsg) focusMsg.innerText = "Tap here to start typing";

    // 2. Trigger keyboard on tap
    // We use touchend to ensure the keyboard pops up reliably on iOS/Android
    gameArea.addEventListener('touchend', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
            mobileInput.focus();
        }
    });

    // 3. Handle Keyboard Input
    mobileInput.addEventListener('input', (e) => {
        const char = e.data; // The character typed
        
        // Handle standard characters
        if (char) {
            const event = new KeyboardEvent('keydown', {
                key: char,
                bubbles: true,
                cancelable: true
            });
            gameArea.dispatchEvent(event);
        } 
        
        // Handle Backspace (e.data is null on backspace in mobile Chrome/Safari)
        else if (e.inputType === 'deleteContentBackward') {
            const event = new KeyboardEvent('keydown', {
                key: 'Backspace',
                bubbles: true
            });
            gameArea.dispatchEvent(event);
        }

        // Keep input empty so the next character is always a new "input" event
        mobileInput.value = '';
    });

    // 4. Special handling for Spacebar
    // Some mobile keyboards don't send 'data' for spaces
    mobileInput.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            const event = new KeyboardEvent('keydown', {
                key: ' ',
                bubbles: true
            });
            gameArea.dispatchEvent(event);
            // Prevent double spacing
            setTimeout(() => { mobileInput.value = ''; }, 10);
        }
    });
}