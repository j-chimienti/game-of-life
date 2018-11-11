import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Board from "./Board";
import {determineStatusOfCell, deepFlatten, chunk, shuffle} from "./utils";
import Params from "./Params";

const boardSize = 2500;

const speed = 950;

class App extends Component {


    paramsModal;
    state = {
        board: '0'.repeat(boardSize),
        boardSize,
        speed, // update every 100ms
        running: false,
        genPerSec: App.getSpeed(speed).genPerSec,
        generation: 0
    };

    gameInterval = null;


    constructor() {

        super();

        this.updateBoard = this.updateBoard.bind(this);
        this.updateSpeed = this.updateSpeed.bind(this);
        this.generateBoard = this.generateBoard.bind(this);
        this.toggleGame = this.toggleGame.bind(this);
        this.handleGenerateBoard = this.handleGenerateBoard.bind(this);
        this.showParamsModal = this.showParamsModal.bind(this);
        this.handleUpdateBoardSize = this.handleUpdateBoardSize.bind(this);
        this.handleCanvasClick = this.handleCanvasClick.bind(this);

    }


    updateSpeed(e) {

        const speed = +e.target.value;

        const {gameSpeed, genPerSec} = App.getSpeed(speed);

        if (this.gameInterval) {

            clearInterval(this.gameInterval);
            this.gameInterval = null;
            this.gameInterval = setInterval(() => this.advanceBoard(), gameSpeed);
        }
        // setInterval(() => this.advanceBoard(), _speed)
        this.setState({
            ...this.state,
            genPerSec,
            speed: +e.target.value,
        });


    }

    handleCanvasClick(e) {

        const {board} = this.state;


        const canvas = document.querySelector('canvas');

        const {top, left} = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const cellsPerRow = Math.sqrt(boardSize);
        const cellWidth = canvas.width / cellsPerRow;
        const row = Math.floor(y / cellWidth);
        const col = Math.floor(x / cellWidth);

        const index = (row * cellsPerRow) + col;
        const _board = [...board.slice(0, index), 1, ...board.slice(index + 1)];

        this.setState({
            ...this.state,
            board: _board.join(""),
        })


    }

    componentDidMount() {

        this.paramsModal = window.$('#showParamsModal');

        this.paramsModal.modal({
            show: false,
        });

        this.generateBoard();
    }


    handleGenerateBoard(e) {
        e.preventDefault();
        this.paramsModal.modal('hide');
        this.generateBoard();

    }

    generateBoard() {

        const {running, boardSize} = this.state;


        if (running) {

            window.alert('invalid request');
            return false;
        }
        const board = Array.from({length: boardSize}, () => 0);

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

    static getSpeed(speed = null) {


        const gameSpeed = 1050 - speed;
        const genPerSec = 1000 / gameSpeed;

        return {
            gameSpeed,
            genPerSec
        };

    }

    startGame() {


        const {gameSpeed, genPerSec} = App.getSpeed(this.state.speed);

        const state = {
            running: true,
            generation: 0,

        };
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;

        }
        this.gameInterval = setInterval(() => this.advanceBoard(), gameSpeed);
        this.setState({
            ...this.state,
            genPerSec,
            state,
        });
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


        const {running} = this.state;
        if (running) {

            clearInterval(this.gameInterval);

            this.gameInterval = null;

            this.setState({
                ...this.state,
                running: false,
            });

        }
        else this.startGame();
    }

    showParamsModal() {

        this.paramsModal.modal({
            show: true,
        });
    }

    render() {
        const {running, generation, genPerSec} = this.state;
        const btnKlass = this.state.running ? 'btn-danger' : 'btn-success';
        return (
            <div className="app container">
                <div className={'row my-3'}>
                     <span

                         className={'text-uppercase px-2'}>
                        Game of Life
                    </span>

                    <button type="button"
                            className="btn btn-primary"
                            data-toggle="modal"
                            data-target="#paramsModal"
                    >
                        <i className="fa fa-wrench">

                        </i>
                    </button>

                    <div className="modal fade" tabIndex="-1" role="dialog" id={'paramsModal'}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Params</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Params
                                        {...this.state}
                                        updateSpeed={this.updateSpeed}
                                        generateBoard={this.generateBoard.bind(this)}
                                        handleUpdateBoardSize={this.handleUpdateBoardSize}
                                        handleGenerateBoard={this.handleGenerateBoard.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    <span className={'mx-2'}>
                        <button className={'btn text-capitalize ' + btnKlass} onClick={this.toggleGame}>
                        {running ? 'stop' : 'start'}
                    </button>

                    </span>

                    <b>Generation: </b>
                    <span className={'mono mx-2'}>
                            {generation}
                            </span>
                    <b>Gen / sec</b>
                    <span className={'mono mx-2'}>
                            {genPerSec.toFixed(1)}
                        </span>

                </div>


                <div className={'row d-flex justify-content-center align-items-center my-3'}>
                    <Board
                        {...this.state}
                        updateBoard={this.updateBoard}
                        handleCanvasClick={this.handleCanvasClick}
                    />
                </div>

            </div>
        );
    }
}

export default App;
