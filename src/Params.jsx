import React from 'react';
import PropTypes from 'prop-types';

function Params({handleGenerateBoard, updateAliveProportion, aliveProportion, boardSize, handleUpdateBoardSize}) {
    return (
        <form className="form-inline mx-2" onSubmit={e => handleGenerateBoard(e)}>
            <div className={'form-group'}>
                <label htmlFor={'boardSize'}>Cells</label>
                <select
                    id={'boardSize'}
                    name={'boardSize'}
                    className={'form-control mb-2 mx-2'}
                    value={boardSize}
                    onChange={handleUpdateBoardSize}
                >
                    <option value={9}>9</option>
                    <option value={100}>100</option>
                    <option value={2500}>2500</option>
                    <option value={10000}>10000</option>
                </select>
            </div>
            <label htmlFor={'aliveProportion'}>
                Alive %
            </label>
            <input
                id={'aliveProportion'}
                name={'aliveProportion'}
                min={1}
                max={99}
                onChange={e => updateAliveProportion(e)}
                className={'form-control mb-2 mx-2'}
                type={'number'}
                value={aliveProportion}
                step={1}
            />
            <button type={'submit'} className={'btn btn-default mx-2 mb-2'}>Generate</button>
        </form>


    );
}

Params.propTypes = {};
Params.defaultProps = {};

export default Params;
