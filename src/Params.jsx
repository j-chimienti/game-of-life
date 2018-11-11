import React from 'react';
import PropTypes from 'prop-types';

function Params({handleGenerateBoard, generateBoard, updateAliveProportion, boardSize, handleUpdateBoardSize, speed, updateSpeed}) {
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
                <div className="input-group-prepend">
                        <span className="input-group-text">
                            Cells
                        </span>
                </div>
                <input
                    value={speed}
                    onChange={updateSpeed}
                    className={'form-control'}
                    type={'range'} min={0} max={1000} />
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

Params.propTypes = {
    speed: PropTypes.number.isRequired,
    updateSpeed: PropTypes.func.isRequired
};
Params.defaultProps = {};

export default Params;
