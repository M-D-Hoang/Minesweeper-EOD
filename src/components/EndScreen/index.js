import React from "react";

import "./style.css";
import success from "../../assets/success.mp3";
import womp from "../../assets/womp.mp3";

class EndScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayed: props.isDisplayed,
        };
    }

    display() {
        this.setState({ isDisplayed: true });
    }

    hide() {
        this.setState({ isDisplayed: false });
    }

    render() {
        const score =
            this.props.gameStatus == "win" ? this.props.secondsElapsed : "-";
        const highScore =
            this.props.highScore != 0 ? this.props.highScore : "-";
        if (this.state.isDisplayed) {
            if (this.props.gameStatus == "win") {
                new Audio(success).play();
            } else if (this.props.gameStatus == "lost") {
                new Audio(womp).play();
            }
            return (
                <div
                    className={"overlay " + this.props.gameStatus}
                    onClick={() => this.hide()}>
                    <div id="endcard">
                        You {this.props.gameStatus}. ⏱️{score} 🏆{highScore}
                    </div>
                </div>
            );
        }
    }
}

export default EndScreen;
