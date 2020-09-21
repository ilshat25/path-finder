// const PriorityQueue = require("./priority_queue.");

var PathFinder = {
    di: [0, 1, 0, -1],
    dj: [-1, 0, 1, 0],

    breadthFistSearch: function* (Matrix) {
        this.processInputMatrix(Matrix);        

        Matrix = this.Matrix;
        const matrix_height = Matrix.length;
        const matrix_width = Matrix[0].length;
        const di = this.di;
        const dj = this.dj;
        const start_point = this.start_point;
        const end_point = this.end_point;

        let ancestors = this.ancestors = Array(matrix_height).fill().map(
            ()=>Array(matrix_width).fill());

        let queue_height = 0, current_dist = 0;
        let queue = [start_point.concat(0)];
        let added = []
        let flag = false;

        while(queue_height < queue.length) {
            let [i, j, dist] = queue[queue_height++];
            if(dist > current_dist) {
                if (flag) break;
                yield added;
                ++current_dist;
                added = []
            }
            if (i == end_point[0] && j == end_point[1])
                    flag = true;
            else if (i != start_point[0] || j != start_point[1])
                added.push([i, j]);
            
            for (let k = 0; k < 4; ++k){
                const ii = i + di[k];
                const jj = j + dj[k];
                if (ii == end_point[0] && jj == end_point[1]){
                    ancestors[ii][jj] = [i, j];
                    queue.push([ii, jj, dist + 1]);
                }
                if (ii >= 0 && ii < matrix_height &&
                    jj >= 0 && jj < matrix_width && 
                    Matrix[ii][jj] == Types.free) {
                    Matrix[ii][jj] = Types.checked;
                    ancestors[ii][jj] = [i, j];
                    queue.push([ii, jj, dist + 1]);
                }
            }
        }
        yield added;
    },
    aStar: function* (Matrix) {
        this.processInputMatrix(Matrix);

        Matrix = this.Matrix;
        const matrix_height = Matrix.length;
        const matrix_width = Matrix[0].length;
        const di = this.di;
        const dj = this.dj;
        const start_point = this.start_point;
        const end_point = this.end_point;

        let ancestors = this.ancestors = Array(matrix_height).fill().map(
            ()=>Array(matrix_width).fill());
        let added = [];
        let queue = new PriorityQueue({comparator: (a, b) => { return a[0] - b[0]; }});
        queue.queue([Math.pow(end_point[0] - start_point[0], 2) + Math.pow(end_point[1] - start_point[1], 2),
                    0,
                    start_point[0],
                    start_point[1]]);
        while(queue.length) {
            let [f, g, i, j] = queue.dequeue();
            
            if (i == end_point[0] && j == end_point[1])
                break;
            if (i != start_point[0] || j != start_point[1]) {
                added.push([i, j]);
                yield added;
                added = [];
            }
            for (let k = 0; k < 4; ++k) {
                const ii = i + di[k];
                const jj = j + dj[k];
                if (ii == end_point[0] && jj == end_point[1]){
                    ancestors[ii][jj] = [i, j];
                    queue.queue([g + 1, g + 1, ii, jj]);
                }
                if (ii >= 0 && ii < matrix_height &&
                    jj >= 0 && jj < matrix_width && 
                    Matrix[ii][jj] == Types.free) {
                    Matrix[ii][jj] = Types.checked;
                    ancestors[ii][jj] = [i, j];
                    queue.queue([g + 1 + Math.pow(end_point[0] - ii, 2) + Math.pow(end_point[1] - jj, 2),
                                 g + 1, ii, jj]);
                }
            }
        }
        yield added;
    },
    // Check if end_point was reached
    isSuccess: function() {
        return this.end_point != undefined;
    },
    // Return path from start_point to end_point
    getPath: function() {
        const start_point = this.start_point;
        const end_point = this.end_point;
        const ancestors = this.ancestors;

        let path = []
        let cur_point = end_point.slice();
        path.push(end_point);
        while(ancestors[cur_point[0]][cur_point[1]]) {
            cur_point = ancestors[cur_point[0]][cur_point[1]].slice();
            path.push(cur_point);
        }

        return path.reverse();
    },
    // Copy Matrix and finds start and end points
    processInputMatrix: function(Matrix) {
        // Copy Matrix
        this.Matrix = Matrix.map(function(arr) {
            return arr.slice();
        });

        // find start and end points
        this.Matrix.forEach( (arr, i) => {
            arr.forEach((type, j) => {
                if (type == Types.start_point)
                    this.start_point = [i, j];
                else if (type == Types.end_point)
                    this.end_point = [i, j];
            });
        });
    }
}