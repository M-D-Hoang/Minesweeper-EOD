import React from "react";
import PropTypes from "prop-types";

import "./style.css";

class Cell extends React.Component {
    getValue() {
        const { value } = this.props;

        if (!value.isRevealed) {
            return this.props.value.isFlagged ? "🚩" : null;
        } else if (value.isMine) {
            return "💣";
        } else if (value.isEmpty || value.isHidden) {
            return "";
        }

        return value.n;
    }

    render() {
        const className =
            "cell" +
            (this.props.value.isHidden ? " hidden" : "") +
            (this.props.value.isMine ? " is-mine" : "") +
            (this.props.value.isClicked ? " is-clicked" : "") +
            (this.props.value.isEmpty ? " is-empty" : "") +
            (this.props.value.isFlagged ? " is-flag" : "") +
            (this.props.value.isPlayer ? " is-player" : "") +
            (this.props.value.isPlayerNearby ? " is-player-nearby" : "") +
            (this.props.value.isFinish ? " finish" : "") +
            " " +
            this.props.value.lastDirection;

        return (
            <div
                className={className}
                onClick={this.props.onClick}
                onContextMenu={this.props.cMenu}>
                {this.getValue()}
            </div>
        );
    }
}

export default Cell;
