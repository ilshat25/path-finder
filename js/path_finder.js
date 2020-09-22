
var PathFinder = {
    breadthFistSearch: async function () {
        const start_point = this.start_point = Grid.start_point;
        const end_point = this.end_point = Grid.end_point;

        let ancestors = this.ancestors = Array(Grid.grid_height).fill().map(
            ()=>Array(Grid.grid_width).fill());

        let queue_height = 0;
        let queue = [start_point];

        while(queue_height < queue.length) {
            const cell = queue[queue_height++];
            
            if (cell.type == Types.end_point)
                break;

            for (let neighbor of Grid.getNeighbors(cell.i, cell.j)) {
                const ii = neighbor.i;
                const jj = neighbor.j;
                if (neighbor.type == Types.free){
                    Grid.setChecked(ii, jj);
                    ancestors[ii][jj] = [cell.i, cell.j];
                    queue.push(neighbor);
                }
                else if (neighbor.type == Types.end_point){
                    ancestors[ii][jj] = [cell.i, cell.j];
                    queue.push(neighbor);
                }
            }
            await this.pause();
            if (Controler.getState() == States.path_building_canceled)
                break;
        }
    },
    aStar: async function() {
        const start_point = this.start_point = Grid.start_point;
        const end_point = this.end_point = Grid.end_point;
        const heuristic = (dx, dy) => { return dx + dy; } 
        const abs = Math.abs;

        let ancestors = this.ancestors = Array(Grid.grid_height).fill().map(
            ()=>Array(Grid.grid_width).fill());

        let queue = new PriorityQueue({comparator: (a, b) => { return a[0] - b[0]; }});
        queue.queue([heuristic(abs(end_point.i - start_point.i), abs(end_point.j - start_point.j)),
                     0,
                     start_point]);
        
        while(queue.length) {
            let [f, g, cell] = queue.dequeue();
            
            if (cell.type == Types.end_point)
                break;
            else if (cell.type != Types.start_point)
                Grid.setChecked(cell.i, cell.j);

            await this.pause();
            if (Controler.getState() == States.path_building_canceled)
                break;

            for(const neighbor of Grid.getNeighbors(cell.i, cell.j)){
                const ii = neighbor.i;
                const jj = neighbor.j;
                if (neighbor.type == Types.free || neighbor.type == Types.end_point) 
                    if(!ancestors[ii][jj]) {
                        queue.queue([g + 1 + heuristic(abs(end_point.i - ii), abs(end_point.j - jj)),
                                    g + 1, 
                                    neighbor]);
                        ancestors[ii][jj] = [cell.i, cell.j];
                    }
            }
        }
    },
    // Sets pause betwee checking values or stops path finding
    pause: async function() {
        do {
            await sleep(Controler.path_finding_speed);
        } while(Controler.getState() == States.path_building_stopped)
    },
    // Check if end_point was reached
    isSuccess: function() {
        return this.ancestors[this.end_point.i][this.end_point.j];
    },
    // Return path from start_point to end_point
    getPath: function() {
        const ancestors = this.ancestors;

        let path = []
        let cur_point = [this.end_point.i, this.end_point.j];
        path.push(cur_point);
        while(ancestors[cur_point[0]][cur_point[1]]) {
            cur_point = ancestors[cur_point[0]][cur_point[1]].slice();
            path.push(cur_point);
        }
        path.map(arr => arr = arr.reverse());
        return path.reverse();
    },
}