'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.processRow = void 0;
function processRow(id, array) {
    const size = Math.sqrt(array.length);
    if (Number.isInteger(size)) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            matrix.push(array.slice(i * size, i * size + size));
        }
        const rotated = rotateMatrix(matrix);
        return [id, rotated.flat(1), true]; // we only flatten 1 level because we don't want to break possible array-in-array inputs
    }
    else {
        return [id, [], false];
    }
}
exports.processRow = processRow;
function rotateMatrix(mat) {
    if (mat.length === 0 || mat.length === 1) {
        return mat;
    }
    let top = 0;
    let bottom = mat.length - 1;
    let left = 0;
    let right = mat[0].length - 1;
    while (left < right && top < bottom) {
        let prev = mat[top][left + 1];
        for (let i = top; i <= bottom; i++) {
            const curr = mat[i][left];
            mat[i][left] = prev;
            prev = curr;
        }
        left++;
        for (let i = left; i <= right; i++) {
            const curr = mat[bottom][i];
            mat[bottom][i] = prev;
            prev = curr;
        }
        bottom--;
        for (let i = bottom; i >= top; i--) {
            const curr = mat[i][right];
            mat[i][right] = prev;
            prev = curr;
        }
        right--;
        for (let i = right; i >= left; i--) {
            const curr = mat[top][i];
            mat[top][i] = prev;
            prev = curr;
        }
        top++;
    }
    return mat;
}
