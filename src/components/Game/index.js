import React from "react";
import Board from "../Board";
import bloop from "../../assets/bloop.mp3";

import "./style.css";

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.boardElement = React.createRef();

        this.state = {
            height: 9,
            width: 40,
            difficulty: "Easy",
            mines: 15,
            isDropdownDisplayed: false,
        };
    }

    changeMines = (value) => {
        new Audio(bloop).play();
        var mines = "";
        switch (value) {
            case "Easy":
                mines = 15;
                break;
            case "Medium":
                mines = 30;
                break;
            case "Hard":
                mines = 45;
                break;
            case "Extreme":
                mines = 60;
                break;
            default:
                break;
        }
        this.boardElement.current.restartBoard(mines);

        this.setState({
            isDropdownDisplayed: false,
            difficulty: value,
            mines: mines,
        });
    };

    displayDropdown = () => {
        new Audio(bloop).play();
        this.setState({ isDropdownDisplayed: true });
    };

    restartGame = () => {
        this.boardElement.current.restartBoard(this.state.mines);
        new Audio(bloop).play();
    };

    render() {
        const { height, width, mines, isDropdownDisplayed } = this.state;
        const className =
            "difficulty-select" + (isDropdownDisplayed ? " show" : "");
        return (
            <div className="game">
                <div>
                    <h1>
                        <strong>MINESWEEPER</strong>:EOD
                    </h1>
                    <p>⚠️ Cross the minefield at your own risk. ⚠️</p>
                </div>
                <Board
                    ref={this.boardElement}
                    height={height}
                    width={width}
                    mines={mines}
                />
                <div className="control-buttons">
                    <button
                        className="difficulty-button"
                        onClick={this.displayDropdown}>
                        {this.state.difficulty}
                    </button>
                    <div class={className}>
                        <button
                            className="difficulty"
                            onClick={() => this.changeMines("Easy")}>
                            Easy
                        </button>
                        <button
                            className="difficulty"
                            onClick={() => this.changeMines("Medium")}>
                            Medium
                        </button>
                        <button
                            className="difficulty"
                            onClick={() => this.changeMines("Hard")}>
                            Hard
                        </button>
                        <button
                            className="difficulty"
                            onClick={() => this.changeMines("Extreme")}>
                            Extreme
                        </button>
                    </div>
                    <button onClick={this.restartGame}>Restart</button>
                </div>
            </div>
        );
    }
}

export default Game;
