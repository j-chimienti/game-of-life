import React from 'react';
import PropTypes from 'prop-types';

function Params({handleGenerateBoard, generateBoard, updateAliveProportion, aliveProportion, boardSize, handleUpdateBoardSize}) {
    return (
        <form className="form mx-2" onSubmit={e => handleGenerateBoard(e)}>

            <div className="input-group mb-3">
                <div className="input-group-prepend">
                        <span className="input-group-text">
                            Cells
                        </span>
                </div>
                <select
                    id={'boardSize'}
                    name={'boardSize'}
                    className={'form-control'}
                    value={boardSize}
                    onChange={handleUpdateBoardSize}
                >
                    <option value={9}>9</option>
                    <option value={100}>100</option>
                    <option value={2500}>2500</option>
                    <option value={10000}>10000</option>
                </select>

            </div>
            <div className={'input-group mb-3'}>
                <div className={'input-group-prepend'}>

                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                            Alive %
                        </span>
                    </div>
                </div>
                <input
                    id={'aliveProportion'}
                    name={'aliveProportion'}
                    min={1}
                    max={99}
                    onChange={e => updateAliveProportion(e)}
                    className={'form-control'}
                    type={'number'}
                    value={aliveProportion}
                    step={1}
                />
                <div className={'input-group-append'}>
                    <button
                        type={'button'}
                        onClick={generateBoard} className={'btn btn-outline-success'}>
                        generate
                    </button>
                </div>
            </div>
            <div className={'row my-3 d-flex align-items-center justify-content-end'}>

                <button


                    type="button" className="btn btn-primary" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    Close
                </button>

            </div>
        </form>


    );
}

Params.propTypes = {};
Params.defaultProps = {};

export default Params;
