import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Board from "./Board";
import {determineStatusOfCell, deepFlatten, chunk, shuffle} from "./utils";
import Params from "./Params";

const boardSize = 100;

class App extends Component {


    state = {
        board: '0'.repeat(boardSize),
        boardSize,
        running: false,
        aliveProportion: 25,
        gameInterval: null,
        generation: 0
    };

    constructor() {

        super();

        this.updateBoard = this.updateBoard.bind(this);
        this.generateBoard = this.generateBoard.bind(this);
        this.toggleGame = this.toggleGame.bind(this);
        this.handleGenerateBoard = this.handleGenerateBoard.bind(this);


    }

    componentDidMount() {
        this.generateBoard();
    }


    handleGenerateBoard(e) {
        e.preventDefault();
        this.generateBoard();

    }

    generateBoard() {

        const {aliveProportion, running, boardSize} = this.state;

        const threshold = (aliveProportion / 100) * boardSize;

        if (running) {

            window.alert('invalid request');
            return false;
        }
        const board = Array.from({length: boardSize}, (v, i) => i < threshold ? 1 : 0);

        const shuffledBoard = shuffle(board);

        const _board = shuffledBoard.join("");

        this.setState({board: _board});


    }

    advanceBoard() {

        const {board, boardSize} = this.state;

        const rowLength = Math.sqrt(boardSize);

        const twoDBoard = chunk(Array.from(board), rowLength);

        const _newBoard = twoDBoard.map((row, y) => row.map((cell, x) => {


            const neighbors = this.getNeigbors(Number(cell), x, y, twoDBoard);
            const aliveCount = neighbors.reduce((total, item) => total + Number(item), 0);
            const alive = determineStatusOfCell(Number(cell), aliveCount);
            return alive ? 1 : 0;
        }));

        const newBoard = deepFlatten(_newBoard).join("");

        this.setState({board: newBoard, generation: this.state.generation + 1});


    }

    startGame() {

        const state = {
            running: true,
            generation: 0,
            gameInterval: setInterval(() => this.advanceBoard(), 100),
        };
        if (this.state.gameInterval) {

            clearInterval(this.state.gameInterval);

            this.setState({gameInterval: null, running: false, generation: 0}, () => {
                this.setState(state);
            });

        }
        else this.setState(state);
    }

    getNeigbors(cell, x, y, array) {

        const upperBound = Math.sqrt(this.state.boardSize) - 1;

        let left = x === 0 ? upperBound : x - 1;

        let right = x === upperBound ? 0 : x + 1;

        let top = y === 0 ? upperBound : y - 1;

        let bottom = y === upperBound ? 0 : y + 1;

        return [
            array[left][y],
            array[x][top],
            array[left][top],
            array[right][y],
            array[x][bottom],
            array[right][bottom],
            array[right][top],
            array[left][bottom],
        ].map(Number);

    }

    updateBoard(cell, x, y) {

        const {board} = this.state;

        const idx = y * Math.sqrt(this.state.boardSize) + x;

        const _board = Array.from(board);

        const updatedCell = Number(_board[idx]) === 1 ? 0 : 1;

        const _newBoard = [..._board.slice(0, idx), updatedCell, ..._board.slice(idx + 1)];

        const newBoard = _newBoard.join("");

        this.setState({board: newBoard});
    }

    handleUpdateBoardSize(e) {

        e.preventDefault();

        const {target: {value}} = e;

        this.setState({
            ...this.state,
            boardSize: Number(value),
            running: false,
            board: '0'.repeat(boardSize)
        }, () => {

            this.generateBoard();
        });

    }

    toggleGame() {


        const {running, gameInterval} = this.state;
        if (running) {

            clearInterval(gameInterval);

            this.setState({
                running: false,
                gameInterval: null,
            });

        }
        else this.startGame();
    }

    render() {
        const {running, generation} = this.state;
        const btnKlass = this.state.running ? 'btn-danger' : 'btn-success';
        return (
            <div className="app container">
                <div className={'row my-3 d-flex justify-content-center-align-items-center'}>
                     <span className={'text-uppercase mx-2 mb-2'}>
                        Game of Life
                    </span>
                     <Params
                         {...this.state}
                         handleUpdateBoardSize={this.handleUpdateBoardSize.bind(this)}
                         handleGenerateBoard={this.handleGenerateBoard.bind(this)}
                         updateAliveProportion={e => this.setState({aliveProportion: e.target.value})}
                     />

                    <span className={'mx-2'}>
                        <button className={'btn text-capitalize ' + btnKlass} onClick={this.toggleGame}>
                        {running ? 'stop' : 'start'}
                    </button>

                    </span>
                     <span className={running ? 'pull-right' : 'd-none'}>

                        <b>Generation: </b>
                        <span className={'mono'}>
                            {generation}
                            </span>
                    </span>
                </div>

                <div className={'row d-flex justify-content-center align-items-center my-3'}>
                    <Board
                        {...this.state}
                        updateBoard={this.updateBoard}
                    />
                </div>

            </div>
        );
    }
}

export default App;
