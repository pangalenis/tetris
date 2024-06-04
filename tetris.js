document.addEventListener('DOMContentLoaded', () => {
    const canvas1 = document.getElementById('board1');
    const canvas2 = document.getElementById('board2');
    const context1 = canvas1.getContext('2d');
    const context2 = canvas2.getContext('2d');
    const scoreDisplay1 = document.getElementById('score1');
    const scoreDisplay2 = document.getElementById('score2');

    const ROWS = 20;
    const COLS = 10;
    let SQ;

    let score1 = 0;
    let score2 = 0;

    function resizeCanvas() {
        const containerHeight = window.innerHeight - 100;
        const boardWidth = containerHeight / ROWS * COLS;
        SQ = containerHeight / ROWS;

        canvas1.width = canvas2.width = boardWidth;
        canvas1.height = canvas2.height = containerHeight;

        drawBoard(board1, context1);
        drawBoard(board2, context2);
        p1.draw(context1);
        p2.draw(context2);
    }

    window.addEventListener('resize', resizeCanvas);

    const VACANT = 'black';

    function drawSquare(x, y, color, context) {
        context.fillStyle = color;
        context.fillRect(x * SQ, y * SQ, SQ, SQ);
        context.strokeStyle = 'white';
        context.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }

    let board1 = [];
    let board2 = [];
    for (let r = 0; r < ROWS; r++) {
        board1[r] = [];
        board2[r] = [];
        for (let c = 0; c < COLS; c++) {
            board1[r][c] = VACANT;
            board2[r][c] = VACANT;
        }
    }

    function drawBoard(board, context) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                drawSquare(c, r, board[r][c], context);
            }
        }
    }

    const I = [
        [
            [1, 1, 1, 1]
        ],
        [
            [1],
            [1],
            [1],
            [1]
        ]
    ];

    const Z = [
        [
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0]
        ]
    ];

    const S = [
        [
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1]
        ]
    ];

    const T = [
        [
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ],
        [
            [0, 1, 0],
            [1, 1, 1]
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0]
        ]
    ];

    const O = [
        [
            [1, 1],
            [1, 1]
        ]
    ];

    const L = [
        [
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1]
        ],
        [
            [0, 0, 1],
            [1, 1, 1]
        ],
        [
            [1, 0],
            [1, 0],
            [1, 1]
        ]
    ];

    const J = [
        [
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        [
            [1, 0, 0],
            [1, 1, 1]
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0]
        ]
    ];

    const PIECES = [
        [Z, 'red'],
        [S, 'green'],
        [T, 'yellow'],
        [O, 'blue'],
        [L, 'purple'],
        [I, 'cyan'],
        [J, 'orange']
    ];

    function randomPiece() {
        let r = Math.floor(Math.random() * PIECES.length);
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }

    function Piece(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.x = 3;
        this.y = -2;
    }

    Piece.prototype.fill = function (color, context) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino[r].length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color, context);
                }
            }
        }
    };

    Piece.prototype.draw = function (context) {
        this.fill(this.color, context);
    };

    Piece.prototype.unDraw = function (context) {
        this.fill(VACANT, context);
    };

    Piece.prototype.moveDown = function (board, context, scoreDisplay, player) {
        if (!this.collision(0, 1, this.activeTetromino, board)) {
            this.unDraw(context);
            this.y++;
            this.draw(context);
        } else {
            this.lock(board, context, scoreDisplay, player);
            if (player === 1) {
                p1 = randomPiece();
                p1.draw(context1);
            } else {
                p2 = randomPiece();
                p2.draw(context2);
            }
        }
    };

    Piece.prototype.moveRight = function (board, context) {
        if (!this.collision(1, 0, this.activeTetromino, board)) {
            this.unDraw(context);
            this.x++;
            this.draw(context);
        }
    };

    Piece.prototype.moveLeft = function (board, context) {
        if (!this.collision(-1, 0, this.activeTetromino, board)) {
            this.unDraw(context);
            this.x--;
            this.draw(context);
        }
    };

    Piece.prototype.rotate = function (board, context) {
        console.log('rotate called');
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        if (!this.collision(0, 0, nextPattern, board)) {
            this.unDraw(context);
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = nextPattern;
            this.draw(context);
        }
    };

    Piece.prototype.collision = function (x, y, piece, board) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece[r].length; c++) {
                if (!piece[r][c]) {
                    continue;
                }
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                console.log(`Checking collision at (${newX}, ${newY}) with value ${newY >= 0 && board[newY] ? board[newY][newX] : 'out of bounds'}`);

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    console.log('Collision with wall');
                    return true;
                }
                if (newY >= 0 && board[newY][newX] !== VACANT) {
                    console.log('Collision with another piece');
                    return true;
                }
            }
        }
        return false;
    };

    Piece.prototype.lock = function (board, context, scoreDisplay, player) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino[r].length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                if (this.y + r < 0) {
                    alert('Game Over');
                    document.location.reload();
                    break;
                }
                board[this.y + r][this.x + c] = this.color;
            }
        }
        removeFullRows(board, context, scoreDisplay, player);
    };
    let interval;
    let intervalTime = 1000;

    function startInterval() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            dropPiece(1);
            dropPiece(2);
        }, intervalTime);
    }

    function decreaseInterval() {
        intervalTime = Math.max(100, intervalTime - 200); // Decrease interval, but not below 100ms
        startInterval();
    }

function removeFullRows(board, context, scoreDisplay, player) {
    let fullRows = 0;
    for (let r = 0; r < ROWS; r++) {
        let isRowFull = true;
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === VACANT) {
                isRowFull = false;
                break;
            }
        }
        if (isRowFull) {
            fullRows++;
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < COLS; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            for (let c = 0; c < COLS; c++) {
                board[0][c] = VACANT;
            }
        }
    }

    if (fullRows > 0) {
        if (player === 1) {
            score1 += fullRows * 10;
            scoreDisplay1.innerText = `Score 1: ${score1}`;
        } else {
            score2 += fullRows * 10;
            scoreDisplay2.innerText = `Score 2: ${score2}`;
        }

        decreaseInterval(); // Decrease interval time

        drawBoard(board, context);
    }
}



    let p1 = randomPiece();
    let p2 = randomPiece();

    p1.draw(context1);
    p2.draw(context2);

    const keys = {};

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
        handleKeys();
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    function handleKeys() {
        if (keys['ArrowLeft']) {
            p2.moveLeft(board2, context2);
        }
        if (keys['ArrowUp']) {
            p2.rotate(board2, context2);
        }
        if (keys['ArrowRight']) {
            p2.moveRight(board2, context2);
        }
        if (keys['ArrowDown']) {
            p2.moveDown(board2, context2, scoreDisplay2, 2);
        }
        if (keys['a']) {
            p1.moveLeft(board1, context1);
        }
        if (keys['w']) {
            p1.rotate(board1, context1);
        }
        if (keys['d']) {
            p1.moveRight(board1, context1);
        }
        if (keys['s']) {
            p1.moveDown(board1, context1, scoreDisplay1, 1);
        }
    }

    function dropPiece(player) {
        if (player === 1) {
            p1.moveDown(board1, context1, scoreDisplay1, 1);
        } else {
            p2.moveDown(board2, context2, scoreDisplay2, 2);
        }
    }

    function startGame() {
        resizeCanvas();
        startInterval();
    }

    startGame();
});

