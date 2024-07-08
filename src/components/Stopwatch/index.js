import React from "react";

import "./style.css";

class Stopwatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsElapsed: 0,
        };
        this.incrementer = null;
    }

    start() {
        if (this.incrementer == null) {
            if (this.props.gameStatus == "ongoing") {
                this.incrementer = setInterval(
                    () =>
                        this.setState({
                            secondsElapsed: this.state.secondsElapsed + 1,
                        }),
                    1000
                );
            }
        }
    }

    stop() {
        this.props.timerCallbackFromBoard(this.state.secondsElapsed);
        clearInterval(this.incrementer);
        this.incrementer = null;
    }

    reset() {
        this.stop();
        this.setState({ secondsElapsed: 0 });
    }
    render() {
        this.start();
        const highScore =
            this.props.highScore != 0 ? this.props.highScore : "-";
        return (
            <div className="stopwatch">
                ⏱️{this.state.secondsElapsed} 🏆{highScore}
            </div>
        );
    }
}

export default Stopwatch;
