import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import {chunk} from "./utils";
import _throttle from 'lodash/throttle';


let canvas = null;
let canvasWidth = getDimensions();

function getDimensions() {

    const w = Math.floor(document.body.clientWidth * .85);

    const h = Math.floor(document.body.clientHeight * .83);

    return Math.min(w, h);
}

window.addEventListener('resize', _throttle(() => {


    canvasWidth = getDimensions();
}, 200));

function Board({board, boardSize, handleCanvasClick}) {


    const _board = Array.from(board);

    const boardArr = chunk(_board, Math.sqrt(boardSize));

    if (canvas) {

        var ctx = canvas.getContext('2d');
        const width = canvasWidth / boardArr[0].length;


        boardArr.map((row, y) => row.map((cell, x) => {

            ctx.fillStyle = Number(cell) === 1 ? '#3CB50F' : '#3399F3';
            ctx.fillRect(x * width, y * width, width, width)
        }));


    }

    return (
        <canvas
            onClick={handleCanvasClick}
            id={'canvas'}
            ref={e => canvas = e}
            width={canvasWidth}
            height={canvasWidth}
        >
        </canvas>
    )
}

Board.propTypes = {
    handleCanvasClick: PropTypes.func.isRequired,
};
Board.defaultProps = {};

export default Board;
