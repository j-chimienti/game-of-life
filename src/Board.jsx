import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import {chunk} from "./utils";


function Board({board, running = false, updateBoard, boardSize}) {

    const _board = Array.from(board);


    const boardArr = chunk(_board, Math.sqrt(boardSize));

    let klass = 'cell pointer ';

    if (2500 === boardSize) {

        klass += 'one-thousand';
    } else if (10000 === boardSize) {

        klass += 'ten-thousand';
    }

    return (
        <div>
            {
                boardArr.map((row, y) => {
                    return (
                        <div className={'row'} key={y}>
                            {row.map((cell, x) => {
                                return (
                                    <div
                                        key={x}
                                        onClick={e => !running && updateBoard(cell, x, y)}
                                        className={Number(cell) === 1 ? `${klass} bg-success` : `${klass} bg-info`}>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })
            }
        </div>
    );
}

Board.propTypes = {};
Board.defaultProps = {};

export default Board;
