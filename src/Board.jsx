import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import {chunk} from "./utils";


let canvas = null;
const canvasWidth = 500;

function Board({board, running = false, updateBoard, boardSize}) {


    const _board = Array.from(board);

    const boardArr = chunk(_board, Math.sqrt(boardSize));

    if (canvas) {

        var ctx = canvas.getContext('2d');
        const width = canvasWidth / boardArr[0].length;



        boardArr.map((row, y) => row.map((cell, x) => {

            ctx.fillStyle = Number(cell) === 1 ? '#3CB50F' : '#3399F3';
            ctx.fillRect(x * width,y * width,width,width)
        }));



    }

    return (
        <canvas id={'canvas'} ref={e => canvas = e} width={canvasWidth} height={canvasWidth}>

        </canvas>
    )
}

Board.propTypes = {};
Board.defaultProps = {};

export default Board;
