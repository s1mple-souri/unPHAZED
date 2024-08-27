document.addEventListener('DOMContentLoaded', () => {
    const initializeTerminal = () => {
        const terminal = new Terminal();
        const terminalElement = document.getElementById('terminal');
        terminal.open(terminalElement);

        const updateDimensions = () => {
            const terminalWindow = document.querySelector('.terminal-window');
            const width = terminalWindow.clientWidth;
            const height = terminalWindow.clientHeight;

            // Approximate character width and height (adjust as necessary)
            const charWidth = 9; // Adjust based on actual character dimensions
            const charHeight = 18; // Adjust based on actual character dimensions

            const cols = Math.floor(width / charWidth);
            const rows = Math.floor(height / charHeight);

            terminal.resize(cols, rows);

            // Optionally log for debugging
            console.log(`Terminal resized to ${cols} cols x ${rows} rows`);
        };

        terminal.writeln('$ Welcome to the Terminal!');
        terminal.writeln('Type "help" for a list of commands.');

        // Update dimensions after a short delay to ensure terminal rendering
        setTimeout(() => {
            updateDimensions();
            // Optionally, listen for resize events to keep terminal responsive
            window.addEventListener('resize', updateDimensions);
        }, 5000);

        // Clear previous event handlers if any
        terminal.onKey(e => {
            const char = e.key;
            if (char === '\r') {
                terminal.writeln('');
            } else if (char === '\u007F') { // Handle backspace
                terminal.write('\b \b');
            } else {
                terminal.write(char);
            }
        });

        terminal.onData(data => {
            // This should not be needed if `onKey` handles input correctly
            // terminal.write(data); 
        });

        // Prevent double input by handling only one event
    };

    setTimeout(initializeTerminal, 5000);
});
