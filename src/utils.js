
export function chunk(arr, size) {

    return Array.from({
            length: Math.ceil(arr.length / size),
        },
        (v, i) => arr.slice(i * size, i * size + size)
    )
}

export function deepFlatten(arr) {

    return [].concat(...arr.map(item => {
        if (Array.isArray(item)) {

            return deepFlatten(item);
        }

        return item
    }));
}

export function shuffle(arr) {

    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]]
    }
    return arr;
}


/*

@param cell {number}
@param aliveCount {number}
@returns status {boolean}
Any live cell with fewer than two live neighbors dies, as if by underpopulation.
Any live cell with two or three live neighbors lives on to the next generation.
Any live cell with more than three live neighbors dies, as if by overpopulation.
Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
 */

export function determineStatusOfCell(cellStatus = 1, aliveCount = 0) {

    if (cellStatus === 1) {
        // is alive

        return !(2 < aliveCount || 3 < aliveCount);

    } else {
        // is dead;

        return aliveCount === 3;

    }
}
