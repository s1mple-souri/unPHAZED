document.addEventListener('DOMContentLoaded', () => {
    const initializeTerminal = () => {
        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 18,
            fontFamily: 'Fira Code, monospace'
        });

        const terminalElement = document.getElementById('terminal');
        terminal.open(terminalElement);

        const prompt = 'user@s1mple_souri$ '; // Custom prompt
        let currentCommand = '';
        let isGameActive = false;

        const updateDimensions = () => {
            const terminalWindow = document.querySelector('.terminal-window');
            const width = terminalWindow.clientWidth;
            const height = terminalWindow.clientHeight;

            // Adjust these values based on the new font size
            const charWidth = 10.8;  // Approximate width of a character in pixels
            const charHeight = 22.9;  // Approximate height of a character in pixels

            const cols = Math.floor(width / charWidth);
            const rows = Math.floor(height / charHeight);

            terminal.resize(cols, rows);

            console.log(`Terminal resized to ${cols} cols x ${rows} rows`);
        };

        const handleCommand = (command) => {
            switch (command.trim()) {
                case 'help':
                    terminal.writeln('help          - Shows this help message.');
                    terminal.writeln('files         - Lists all files.');
                    terminal.writeln('play xo       - Starts a game of Tic-Tac-Toe.');
                    terminal.writeln('echo "string" - Displays the string.');
                    terminal.writeln('about         - Displays information about the user.');
                    break;
                case 'files':
                    terminal.writeln('Files available:\n');
                    terminal.writeln('1. image.png');
                    terminal.writeln('2. document.pdf');
                    terminal.writeln('3. presentation.ppt');
                    break;
                case 'play xo':
                    terminal.writeln('Starting Tic-Tac-Toe game...');
                    startTicTacToeGame();
                    break;
                case 'about':
                    terminal.writeln('About Me:\n- [Your hobbies and details here]');
                    break;
                default:
                    if (command.startsWith('echo ')) {
                        terminal.writeln(command.slice(5));
                    } else {
                        terminal.writeln(`Ayo you trippin'? Whats "${command.trim()}"? Type 'help' and get some help`);
                    }
                    break;
            }
        };

        let board = Array(9).fill(null);
        let currentPlayer = 'X';
        let gameEnded = false;

        const getRandomUserComment = () => {
            const comments = [
                'Nice Move, you got brainz! Let me think...',
                'Now that was dumb, you gotta know some basics lol.',
                'Interesting choice, let’s see what I can do!',
                'Are you sure that was a good move? Anyway, my turn!'
            ];
            return comments[Math.floor(Math.random() * comments.length)];
        };

        const printBoard = () => {
            terminal.writeln('');
            terminal.writeln(`${board[0] || '1'} | ${board[1] || '2'} | ${board[2] || '3'}`);
            terminal.writeln('---------');
            terminal.writeln(`${board[3] || '4'} | ${board[4] || '5'} | ${board[5] || '6'}`);
            terminal.writeln('---------');
            terminal.writeln(`${board[6] || '7'} | ${board[7] || '8'} | ${board[8] || '9'}`);
        };

        const checkWin = () => {
            const winPatterns = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            for (const [a, b, c] of winPatterns) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
            return board.every(cell => cell) ? 'Tie' : null;
        };

        const minimax = (depth, isMaximizing) => {
            const result = checkWin();
            if (result === 'X') return -10;
            if (result === 'O') return 10;
            if (result === 'Tie') return 0;
        
            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === null) {
                        board[i] = 'O'; // AI's move
                        let score = minimax(depth + 1, false);
                        board[i] = null;
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === null) {
                        board[i] = 'X'; // Player's move
                        let score = minimax(depth + 1, true);
                        board[i] = null;
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        };
        
        const getBestMove = () => {
            let bestMove = null;
            let bestScore = -Infinity;
        
            // Check for a winning move first
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    if (checkWin() === 'O') {
                        board[i] = null; // Undo the move
                        return i; // Winning move
                    }
                    board[i] = null;
                }
            }
        
            // If no winning move, check for blocking moves
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    if (checkWin() === 'X') {
                        board[i] = null; // Undo the move
                        return i; // Blocking move
                    }
                    board[i] = null;
                }
            }
        
            // If no immediate win or block, use minimax
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    let score = minimax(0, false);
                    board[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
        
            return bestMove;
        };
        
        
        const handlePlayerMove = (move) => {
            if (board[move - 1] === null) {
                board[move - 1] = currentPlayer;
                printBoard();
                gameEnded = checkWin();
                if (gameEnded) {
                    terminal.writeln('');
                    terminal.writeln(gameEnded === 'Tie' ? 'It\'s a tie! , the best outcome you can reach LMAO' : `${gameEnded} wins!, As Expected`);
                    terminal.writeln('Skill ishuzzz, Grow a bit. Wait. Still wont help against me hwahahaha')
                    setTimeout(() => {
                        resetGame();
                    }, 2000); // Show reset message before resetting
                } else {
                    currentPlayer = 'O'; // Switch to AI
                    terminal.writeln('');
                    terminal.writeln(getRandomUserComment())
                    setTimeout(() => {
                        handleAIMove();
                    }, 1000); // AI move after 1 second
                }
            } else {
                terminal.writeln('Yo, Take this chlorine, and wash your eyes. Try another number.');
            }
        };
        
        const handleAIMove = () => {
            const move = getBestMove();
            if (move !== undefined) {
                board[move] = 'O';
                printBoard();
                gameEnded = checkWin();
                if (gameEnded) {
                    terminal.writeln('');
                    terminal.writeln(gameEnded === 'Tie' ? 'It\'s a tie! , the best outcome you can reach LMAO' : `${gameEnded} wins!, As Expected`);
                    terminal.writeln('Skill ishuzzz, Grow a bit. Wait. Still wont help against me hwahahaha')
                    resetGame();
                } else {
                    currentPlayer = 'X'; // Switch back to player
                }
            }
        };
        

        const startTicTacToeGame = () => {
            terminal.writeln('Tic-Tac-Toe game started! Enter a box number (1-9):');
            board = Array(9).fill(null);
            currentPlayer = 'X'; // Reset player to 'X'
            gameEnded = false;
            printBoard();
            isGameActive = true; // Game is active
        };

        const resetGame = () => {
            terminal.writeln('Game has been reset.');
            isGameActive = false
        };
        

        const printPrompt = () => {
            if (isGameActive) {
                terminal.write(`\r\nYour_Move$ `);
            } else {
                terminal.write(`\r\n${prompt}`);
            }
        };
        

        terminal.writeln(`Welcome to the Terminal!`);
        terminal.writeln(`Type "help" for a list of commands.`);

        setTimeout(() => {
            updateDimensions();
            window.addEventListener('resize', updateDimensions);
        }, 5000);

        terminal.onData(data => {

            if (data.startsWith('\x1b') && data.length > 2) {
                // Ignore escape sequences for arrow keys (e.g., '\x1b[A' for up arrow)
                return;
            }

            if (data === '\r') { // Enter key
                terminal.writeln(''); // Move to the next line
                if (isGameActive) {
                    const move = parseInt(currentCommand.trim(), 10);
                    if (!isNaN(move) && move >= 1 && move <= 9) {
                        handlePlayerMove(move);
                    } else {
                        terminal.writeln('Whats That brodha, Enter a number between 1 and 9.');
                    }
                    setTimeout(() => {
                        currentCommand = ''; // Reset command buffer
                        printPrompt(); // Print the prompt on a new line
                    }, 2000);
                } else {
                    handleCommand(currentCommand); // Handle the command entered
                    currentCommand = ''; // Reset command buffer
                    printPrompt(); // Print the prompt on a new line
                }
                
            } else if (data === '\u007F') { // Backspace key
                if (currentCommand.length > 0) {
                    terminal.write('\b \b'); // Remove the last character
                    currentCommand = currentCommand.slice(0, -1); // Remove from buffer
                }
            } else {
                currentCommand += data; // Append the input character
                terminal.write(data); // Display the character
            }
        });

        printPrompt(); // Initial prompt display
    };

    initializeTerminal();
});
