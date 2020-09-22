
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
            
            Grid.setChecked(cell.i, cell.j);

            if (cell.type == Types.end_point)
                break;
            await this.pause();
            if (Controler.getState() == States.path_building_canceled)
                break;

            for (let neighbor of Grid.getNeighbors(cell.i, cell.j)) {
                const ii = neighbor.i;
                const jj = neighbor.j;
                if (!ancestors[ii][jj]){
                    if (neighbor.type == Types.cur_checked){
                        ancestors[ii][jj] = [cell.i, cell.j];
                        queue.push(neighbor);
                    }
                    else if (neighbor.type == Types.end_point){
                        ancestors[ii][jj] = [cell.i, cell.j];
                        queue.push(neighbor);
                    }
                }
        }
        }
    },
    greedyBreadthFistSearch: async function(heuristic = 'manhattan') {
        const start_point = this.start_point = Grid.start_point;
        const end_point = this.end_point = Grid.end_point;
        const abs = Math.abs;
        const sqrt = Math.sqrt;
        const pow = Math.pow;
        switch(heuristic){
            case 'manhattan':
                heuristic = (p1, p2) => { return abs(p1.i - p2.i) + abs(p1.j - p2.j); } 
                break;
            case 'euclidean':
                heuristic = (p1, p2) => { return sqrt(pow(p1.i - p2.i, 2) + pow(p1.j - p2.j, 2)); } 
                break;
        };

        let ancestors = this.ancestors = Array(Grid.grid_height).fill().map(
            ()=>Array(Grid.grid_width).fill());
        let items = Array(Grid.grid_height).fill().map(()=>Array(Grid.grid_width).fill());

        let heap = new Heap((a, b) => { return a.h - b.h; });
        items[start_point.i][start_point.j] = {h: 0, cell: start_point}
        heap.push(items[start_point.i][start_point.j]);

        while(!heap.empty()) {
            var {h, cell} = heap.pop();

            Grid.setChecked(cell.i, cell.j);
            if (cell.type == Types.end_point)
                break;

            await this.pause();
            if (Controler.getState() == States.path_building_canceled)
                break;

            for(const neighbor of Grid.getNeighbors(cell.i, cell.j))
                if (neighbor.type == Types.cur_checked || neighbor.type == Types.end_point) {
                    const ii = neighbor.i;
                    const jj = neighbor.j;
                    const item = {h: heuristic(end_point, neighbor),
                                  cell: neighbor};
                    if(!items[ii][jj]) {
                        ancestors[ii][jj] = [cell.i, cell.j];
                        items[ii][jj] = item;
                        heap.push(item);
                    }
                    else if (item.h < items[ii][jj].h){
                        items[ii][jj].h = item.h;
                        ancestors[ii][jj] = [cell.i, cell.j];
                        heap.updateItem(items[ii][jj]);
                    }
                }
        }
    },
    aStar: async function(heuristic = 'manhattan') {
        const start_point = this.start_point = Grid.start_point;
        const end_point = this.end_point = Grid.end_point;
        const abs = Math.abs;
        const sqrt = Math.sqrt;
        const pow = Math.pow;
        switch(heuristic){
            case 'manhattan':
                heuristic = (p1, p2) => { return abs(p1.i - p2.i) + abs(p1.j - p2.j); } 
                break;
            case 'euclidean':
                heuristic = (p1, p2) => { return sqrt(pow(p1.i - p2.i, 2) + pow(p1.j - p2.j, 2)); } 
                break;
        };

        let ancestors = this.ancestors = Array(Grid.grid_height).fill().map(
            ()=>Array(Grid.grid_width).fill());
        let items = Array(Grid.grid_height).fill().map(()=>Array(Grid.grid_width).fill());

        let heap = new Heap((a, b) => { return a.f - b.f; });
        items[start_point.i][start_point.j] = {f: 0, g: 0, cell: start_point}
        heap.push(items[start_point.i][start_point.j]);

        while(!heap.empty()) {
            var {f, g, cell} = heap.pop();

            Grid.setChecked(cell.i, cell.j);
            if (cell.type == Types.end_point)
                break;

            await this.pause();
            if (Controler.getState() == States.path_building_canceled)
                break;

            for(const neighbor of Grid.getNeighbors(cell.i, cell.j))
                if (neighbor.type == Types.cur_checked || neighbor.type == Types.end_point) {
                    const ii = neighbor.i;
                    const jj = neighbor.j;
                    const item = {f: g + 1 + heuristic(end_point, neighbor),
                                  g: g + 1, 
                                  cell: neighbor};
                    if(!items[ii][jj]) {
                        ancestors[ii][jj] = [cell.i, cell.j];
                        items[ii][jj] = item;
                        heap.push(item);
                    }
                    else if (item.g < items[ii][jj].g){
                        items[ii][jj].f = item.f;
                        items[ii][jj].g = item.g;
                        ancestors[ii][jj] = [cell.i, cell.j];
                        heap.updateItem(items[ii][jj]);
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