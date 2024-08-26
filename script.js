
// Load the fit add-on
const fitAddon = new FitAddon.FitAddon();
terminal.loadAddon(fitAddon);

// Open the terminal in the #terminal element
terminal.open(document.getElementById('terminal'));

// Fit the terminal to the container
fitAddon.fit();

// Initialize with the prompt symbol
terminal.writeln('Welcome to your Web CLI!');
terminal.write('\r\n$ ');

// Adjust the terminal size dynamically when the window is resized
window.addEventListener('resize', () => {
    fitAddon.fit();
});

// Keep track of cursor position to maintain prompt
let isPrompt = true;

terminal.onKey(({ key, domEvent }) => {
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter key
        terminal.write('\r\n$ '); // Add new prompt line
        isPrompt = true;
    } else if (domEvent.keyCode === 8) { // Backspace key
        if (!isPrompt) {
            terminal.write('\b \b'); // Handle backspace
        }
    } else if (printable) {
        terminal.write(key); // Insert character
        isPrompt = false;
    }
});

const terminal = new Terminal({
    cursorBlink: true
});
