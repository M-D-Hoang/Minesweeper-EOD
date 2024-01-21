import React from "react";
import PropTypes from "prop-types";
import Cell from "../Cell";
import boom from "../../assets/vine-boom.mp3";
import shovel1 from "../../assets/shovel1.mp3";
import shovel2 from "../../assets/shovel2.mp3";
import shovel3 from "../../assets/shovel3.mp3";
import shovel4 from "../../assets/shovel4.mp3";
import step1 from "../../assets/step1.mp3";
import step2 from "../../assets/step2.mp3";
import step3 from "../../assets/step3.mp3";
import step4 from "../../assets/step4.mp3";
import errorSound from "../../assets/error.mp3";
import flag from "../../assets/flag.mp3";
import win from "../../assets/win.mp3";

const shovelSounds = [shovel1, shovel2, shovel3, shovel4];
const stepSounds = [step1, step2, step3, step4];

import "./style.css";
import Stopwatch from "../Stopwatch";
import EndScreen from "../EndScreen";

class Board extends React.Component {
    state = this.getInitialState();
    stopwatchElement = React.createRef();
    endScreenElement = React.createRef();
    highScore = 0;

    getInitialState(mines = this.props.mines) {
        if (mines != this.props.mines) {
            this.highScore = 0;
        }
        const initialState = {
            grid: this.createNewBoard(mines),
            minesCount: mines,
            gameStatus: "paused",
            secondsElapsed: 0,
            revealedCells: 0,
            playerY: 4,
            playerX: 1,
        };
        initialState.grid[initialState.playerY][
            initialState.playerX
        ].isPlayer = true;
        initialState.grid[initialState.playerY][
            initialState.playerX
        ].lastDirection = "right";
        return initialState;
    }

    createNewBoard(mines) {
        const grid = [];
        const rows = this.props.width;
        const columns = this.props.height;
        const minesCount = mines;
        const minesArray = this.getRandomMines(minesCount, columns, rows);

        for (let i = 0; i < columns; ++i) {
            grid.push([]);
            for (let j = 0; j < rows; ++j) {
                const gridCell = new GridCell(
                    i,
                    j,
                    this.isMine(minesArray, [i, j])
                );
                if (j < 3) {
                    gridCell.isHidden = false;
                }
                if (j >= rows - 3) {
                    gridCell.isHidden = false;
                    gridCell.isFinish = true;
                }
                this.addGridCell(grid, gridCell);
            }
        }
        return grid;
    }

    getRandomMines(amount, columns, rows) {
        const minesArray = [];

        while (minesArray.length < amount) {
            const x = Math.floor(Math.random() * (rows - 8)) + 4;
            const y = Math.floor(Math.random() * columns);

            if (!this.isMine(minesArray, [y, x])) {
                minesArray.push([y, x]);
            }
        }
        return minesArray;
    }

    isMine(minesArray, position) {
        return JSON.stringify(minesArray).includes(JSON.stringify(position));
    }

    addGridCell(grid, gridCell) {
        const x = grid.length - 1;
        const y = grid[x].length;
        const lastGridCell = gridCell;
        const neighbours = this.getNeighbours(grid, x, y);

        for (let neighbourGridCell of neighbours) {
            if (lastGridCell.isMine) {
                neighbourGridCell.n += 1;
            } else if (neighbourGridCell.isMine) {
                lastGridCell.n += 1;
            }
        }

        grid[x].push(gridCell);
    }

    async revealBoard() {
        await new Promise((r) => setTimeout(r, 1000));
        const grid = this.state.grid;
        for (const row of grid) {
            for (const gridCell of row) {
                if (this.state.gameStatus == "paused") {
                    return
                }
                if (gridCell.isMine && !gridCell.isRevealed) {
                    gridCell.isRevealed = true;
                    var boomSound = new Audio(boom);
                    boomSound.volume = 0.4 + Math.random() / 2;
                    boomSound.play();
                    this.forceUpdate();
                    await new Promise((r) =>
                        setTimeout(
                            r,
                                50+((Math.random() * 1000) ^ 2) /
                                    (this.state.minesCount / 10)
                        )
                    );
                }
            }
        }
        await new Promise((r) => setTimeout(r, 1000));
        this.endScreenElement.current.display();
        this.forceUpdate();
        this.setState({});
    }

    restartBoard(value) {
        this.setState(this.getInitialState(value));
        this.stopwatchElement.current.reset();
        this.forceUpdate();
    }

    getNeighbours(grid, x, y) {
        const neighbours = [];
        const currentRow = grid[x];
        const prevRow = grid[x - 1];
        const nextRow = grid[x + 1];

        if (currentRow[y - 1]) neighbours.push(currentRow[y - 1]);
        if (currentRow[y + 1]) neighbours.push(currentRow[y + 1]);
        if (prevRow) {
            if (prevRow[y - 1]) neighbours.push(prevRow[y - 1]);
            if (prevRow[y]) neighbours.push(prevRow[y]);
            if (prevRow[y + 1]) neighbours.push(prevRow[y + 1]);
        }
        if (nextRow) {
            if (nextRow[y - 1]) neighbours.push(nextRow[y - 1]);
            if (nextRow[y]) neighbours.push(nextRow[y]);
            if (nextRow[y + 1]) neighbours.push(nextRow[y + 1]);
        }

        return neighbours;
    }

    checkVictory() {
        if (this.state.playerX >= this.props.width - 3) {
            this.killBoard("win");
            new Audio(win).play();
            this.forceUpdate();
        }
    }

    killBoard(type) {
        this.stopwatchElement.current.stop()
        if (type == "win") {
            if (this.state.secondsElapsed < this.highScore || this.highScore == 0) {
                this.highScore = this.state.secondsElapsed
            }
        }
        this.setState({ gameStatus: type }, () => {
            this.revealBoard();
        });
    }

    async probe(x, y) {
        if (this.state.gameStatus == "ongoing") {
            const grid = this.state.grid;
            const gridCell = grid[x][y];

            if (gridCell.isHidden) {
                gridCell.isHidden = false;
                new Audio(
                    shovelSounds[
                        Math.floor(Math.random() * shovelSounds.length)
                    ]
                ).play();
            } else {
                new Audio(
                    stepSounds[Math.floor(Math.random() * stepSounds.length)]
                ).play();
            }

            if (gridCell.isMine) {
                gridCell.isRevealed = true;
                new Audio(boom).play();
                this.killBoard("lost");
            }

            gridCell.isRevealed = true;
        }
        this.forceUpdate();
    }

    handleRightClick(e, x, y) {
        e.preventDefault();
        if (this.state.gameStatus == "ongoing") {
            const grid = this.state.grid;
            let minesLeft = this.state.minesCount;

            if (grid[x][y].isRevealed) return false;

            if (grid[x][y].isFlagged) {
                grid[x][y].isFlagged = false;
                minesLeft++;
                new Audio(flag).play();
            } else {
                grid[x][y].isFlagged = true;
                minesLeft--;
                new Audio(flag).play();
            }

            this.setState({
                minesCount: minesLeft,
            });
        }
    }

    movePlayer(x, y) {
        this.state.gameStatus = "ongoing";
        const grid = this.state.grid;
        if (grid[this.state.playerY + y][this.state.playerX + x].isFlagged) {
            grid[this.state.playerY + y][
                this.state.playerX + x
            ].isFlagged = false;
            new Audio(flag).play();
        } else {
            grid[this.state.playerY][this.state.playerX].isPlayer = false;
            const lastDirection =
                grid[this.state.playerY][this.state.playerX].lastDirection;
            grid[this.state.playerY][this.state.playerX].lastDirection = "";
            this.updatePlayerNearby(
                grid,
                this.state.playerX,
                this.state.playerY,
                false
            );
            this.probe((this.state.playerY += y), (this.state.playerX += x));

            grid[this.state.playerY][this.state.playerX].isPlayer = true;
            this.updatePlayerNearby(
                grid,
                this.state.playerX,
                this.state.playerY,
                true
            );
            if (x == -1) {
                grid[this.state.playerY][this.state.playerX].lastDirection =
                    "left";
            } else if (x == 1) {
                grid[this.state.playerY][this.state.playerX].lastDirection =
                    "right";
            } else {
                grid[this.state.playerY][this.state.playerX].lastDirection =
                    lastDirection;
            }
        }
        this.setState({}, () => {
            this.checkVictory();
        });
    }

    updatePlayerNearby(grid, x, y, isNearNewPosition) {
        this.updatePlayerNearbyCell(grid, x - 1, y - 1, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x, y - 1, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x + 1, y - 1, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x - 1, y, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x + 1, y, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x - 1, y + 1, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x, y + 1, isNearNewPosition);
        this.updatePlayerNearbyCell(grid, x + 1, y + 1, isNearNewPosition);
    }

    updatePlayerNearbyCell(grid, x, y, isNearNewPosition) {
        if (y >= 0 && y < this.props.height && x >= 0 && x < this.props.width) {
            grid[y][x].isPlayerNearby = isNearNewPosition;
        }
    }

    handleKeyPress(event) {
        event.preventDefault();
        if (
            this.state.gameStatus == "ongoing" ||
            this.state.gameStatus == "paused"
        ) {
            switch (event.key.toLowerCase()) {
                case "w":
                    if (this.state.playerY > 0) {
                        this.movePlayer(0, -1);
                    } else {
                        new Audio(errorSound).play();
                    }
                    break;
                case "a":
                    if (this.state.playerX > 0) {
                        this.movePlayer(-1, 0);
                    } else {
                        new Audio(errorSound).play();
                    }
                    break;
                case "s":
                    if (this.state.playerY < this.props.height - 1) {
                        this.movePlayer(0, 1);
                    } else {
                        new Audio(errorSound).play();
                    }
                    break;
                case "d":
                    if (this.state.playerX < this.props.width - 1) {
                        this.movePlayer(1, 0);
                    } else {
                        new Audio(errorSound).play();
                    }
                    break;
                default:
            }
        }
    }

    timerCallback = (secondsElapsed) => {
        this.state.secondsElapsed = secondsElapsed;
    }
    
    renderBoard() {
        const grid = this.state.grid;

        return grid.map((row) => {
            const rowCells = row.map((gridCell) => (
                <Cell
                    onClick={() => this.probe(gridCell.x, gridCell.y)}
                    cMenu={(e) =>
                        this.handleRightClick(e, gridCell.x, gridCell.y)
                    }
                    value={gridCell}
                    gameStatus={this.state.gameStatus}
                />
            ));

            return <div className="row">{rowCells}</div>;
        });
    }

    render() {
        return (
            <div className="board">
                <EndScreen ref={this.endScreenElement} highScore={this.highScore} gameStatus={this.state.gameStatus} secondsElapsed={this.state.secondsElapsed}/>
                <div className="stopwatch">
                    <Stopwatch ref={this.stopwatchElement} highScore={this.highScore} gameStatus={this.state.gameStatus} timerCallbackFromBoard={this.timerCallback} />
                </div>
                <div
                    className="grid"
                    onKeyDown={(e) => this.handleKeyPress(e)}
                    tabIndex="0">
                    {this.renderBoard()}
                </div>
            </div>
        );
    }
}

class GridCell {
    constructor(x, y, isMine) {
        this.y = y;
        this.x = x;
        this.n = 0;
        this.isMine = isMine;
        this.isHidden = true;
        this.isRevealed = false;
        this.isFlagged = false;
        this.isClicked = false;
        this.isPlayer = false;
        this.isPlayerNearby = false;
        this.lastDirection = "";
        this.isFinish = false;
    }
    get isEmpty() {
        return this.n === 0 && !this.isMine;
    }
}

export default Board;
