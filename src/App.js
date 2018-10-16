import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Board from "./Board";
import {determineStatusOfCell, deepFlatten, chunk, shuffle} from "./utils";

const boardSize = 100;

class App extends Component {


    state = {
        board: '0'.repeat(boardSize),
        boardSize,
        running: false,
        aliveProportion: .5,
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

        const threshold = aliveProportion * boardSize;

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

        const _b = chunk(Array.from(board), rowLength);

        const neighbors = _b.map((row, y) => row.map((cell, x) => {
            return {
                neighbors: this.getNeigbors(Number(cell), x, y, _b),
                cell: Number(cell),
                x,
                y,
            }
        }));

        const bb = neighbors.map(row => {
            return row.map(cell => {
                const aliveCount = cell.neighbors.reduce((total, item) => total + Number(item), 0);
                const alive = determineStatusOfCell(cell.cell, aliveCount);

                if (alive) {

                    return 1;
                }

                return 0;
            })
        });
        const newBoard = deepFlatten(bb).join("");

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
        const btnKlass = this.state.running ? 'btn-danger' : 'btn-success';
        return (
            <div className="app container">
                <h1 className={'my-3 text-center text-uppercase'}>Game of Life
                    <span className={'pl-3'}>
                        <button className={'btn text-capitalize ' + btnKlass} onClick={this.toggleGame}>
                        {this.state.running ? 'stop' : 'start'}
                    </button>

                    </span>
                </h1>
                <div className={'row'}>
                    <div className={'col-md-3'}>
                        <div className={'row'}>
                            <form>
                                <label>Cells</label>
                                <select
                                    className={'form-control'}
                                    value={this.state.boardSize} onChange={e => this.handleUpdateBoardSize(e)}>
                                    <option value={9}>9</option>
                                    <option value={100}>100</option>
                                    <option value={2500}>2500</option>
                                    <option value={10000}>10000</option>
                                </select>
                            </form>
                        </div>
                        <div className={'row my-3'}>
                            <form onSubmit={e => this.handleGenerateBoard(e)}>
                                <label>
                                    Alive %
                                </label>
                                <input
                                    onChange={e => this.setState({aliveProportion: e.target.value})}
                                    className={'form-control'} type={'number'} value={this.state.aliveProportion}
                                    step={0.05}
                                />
                                <button type={'submit'} className={'my-2 btn btn-info'}>Generate</button>
                            </form>
                        </div>
                        <div className={'row my-3'}>
                            <h3 className={this.state.running ? null : 'd-none'}>

                                <b>Generation: </b>
                                <span className={'mono'}>
                                    {this.state.generation}
                                </span>
                            </h3>
                        </div>


                    </div>
                    <div className={'col-md-9 row d-flex my-3'}>
                        <Board
                            {...this.state}
                            updateBoard={this.updateBoard}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
