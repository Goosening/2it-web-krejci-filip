const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let mazeStart = { x: 1, y: 1 };
let mazeEnd = { x: cols - 2, y: rows - 2 };

const maze = [];
for (let i = 0; i < rows; i++) {
    maze[i] = [];
    for (let j = 0; j < cols; j++) {
        maze[i][j] = 0;
    }
}

const drawMaze = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze[i][j] === 0) {
                ctx.fillStyle = "#1e293b";
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            } else {
                ctx.fillStyle = "#f8fafc";
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
    ctx.fillStyle = "#10b981";
    ctx.fillRect(mazeStart.x * cellSize, mazeStart.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(mazeEnd.x * cellSize, mazeEnd.y * cellSize, cellSize, cellSize);
}

resetMaze = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            maze[i][j] = 0;
        }
    }
}

const recursive = (x, y) => {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    shuffle(directions);
    for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isInBounds(nx, ny) && maze[ny][nx] === 0) {
            maze[y + dy][x + dx] = 1;
            maze[ny][nx] = 1;
            recursive(nx, ny);
        }
    }
}

const generateMaze = () => {
    resetMaze();
    maze[1][1] = 1;
    recursive(1, 1);

    const wallsToRemove = Math.floor((cols * rows) * 0.15);
    for (let i = 0; i < wallsToRemove; i++) {
        const rx = Math.floor(Math.random() * (cols - 2)) + 1;
        const ry = Math.floor(Math.random() * (rows - 2)) + 1;

        if (maze[ry][rx] === 0) {
            maze[ry][rx] = 1;
        }
    }

    drawMaze();
}

const isInBounds = (x, y) => {
    return x > 0 && x < cols - 1 && y > 0 && y < rows - 1;
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const bfs = (x, y, visited) => {
    const queue = [{ x, y, path: [] }];
    visited[y][x] = true;
    while (queue.length > 0) {
        const { x, y, path } = queue.shift();
        if (x === mazeEnd.x && y === mazeEnd.y) {
            return path;
        }
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isInBounds(nx, ny) && maze[ny][nx] === 1 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });
            }
        }
    }
    return null;
}

const solveMaze = () => {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path = bfs(mazeStart.x, mazeStart.y, visited);
    if (path) {
        ctx.fillStyle = "#ef4444";
        for (const { x, y } of path) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        ctx.fillStyle = "#10b981";
        ctx.fillRect(mazeStart.x * cellSize, mazeStart.y * cellSize, cellSize, cellSize);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(mazeEnd.x * cellSize, mazeEnd.y * cellSize, cellSize, cellSize);
    }
}

document.getElementById("generate").addEventListener("click", generateMaze);
document.getElementById("solve").addEventListener("click", solveMaze);