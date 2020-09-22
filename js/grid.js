// Responsive for window grid
var Grid = {
    // Initialization of grid
    init: function() {
        const grid_width = this.grid_width = 64;
        const grid_height = this.grid_height = 36;
        const tile_size = this.tile_size = 30;
        let arr = this.arr = [];
        let svg = this.svg = d3.select('#grid')
                           .append('svg')
                           .attr('width', this.convertToWindowCords(grid_width))
                           .attr('height', this.convertToWindowCords(grid_height));
                      
        for (let i = 0; i < grid_height; ++i){
            arr.push([]);
            for (let j = 0; j < grid_width; ++j) {
                let rect = svg.append('rect')
                   .attr('x', this.convertToWindowCords(j))
                   .attr('y', this.convertToWindowCords(i));
                
                arr[i].push({
                    rect: rect,
                    type: Types.free,
                    i: i,
                    j: j});
            }
        }

        svg.selectAll('rect')
           .attr('class', 'rect')
           .attr('width', tile_size)
           .attr('height', tile_size)
           .attr('fill', Styles[Types.free].fill)
           .attr('stroke-opacity', 0.2);    
    },
    // Make the cell checked
    setChecked: function(i, j) {
        if (this.getType(i, j) != Types.start_point && this.getType(i, j) != Types.end_point)
            this.changeType(i, j, Types.checked);
        let neighbors = this.getNeighbors(i, j);
        for(neighbor of neighbors) if (neighbor.type == Types.free)
            this.changeType(neighbor.i, neighbor.j, Types.cur_checked);
    },
    // Get neighbors cells
    getNeighbors: function(i, j) {
        let neighbors = [];
        const di = [-1, 0, 1, 0];
        const dj = [0, 1, 0, -1];
        for (let k = 0; k < 4; ++k) {
            const ii = i + di[k];
            const jj = j + dj[k];
            if (ii >= 0 && ii < this.grid_height &&
                jj >= 0 && jj < this.grid_width)
                neighbors.push(this.arr[ii][jj]);
        }
        return neighbors;
    },
    // Set all rect with type from types_to_clear to default 
    clear: function(types_to_clear) {
        this.arr.forEach( (a, i) => {
            a.forEach( (element, j) => {
                const type = element.type;
                if (types_to_clear.includes(type))
                    this.changeType(i, j, Types.free);
            });
        });

        if (this.lineGraph)
            this.lineGraph.remove();
        delete(this.added_prev);
    },
    // Clear blocked, checked and cur_checked rects
    clearGrid: function() {
        this.clear([Types.blocked,
                    Types.checked,
                    Types.cur_checked]);
    },
    // Clear checked and cur_checked rects
    clearChecked: function() {
        this.clear([Types.checked,
                    Types.cur_checked]);
    },
    // Build path according to path array
    buildPath: function(path) {
        path.forEach(pos => {
            pos[0] = this.convertToWindowCords(pos[0]) + this.tile_size / 2;
            pos[1] = this.convertToWindowCords(pos[1]) + this.tile_size / 2;
        });
        let lineGenerator = d3.line()(path);
        this.lineGraph = this.svg.append('path')
                                 .attr('d', lineGenerator)
                                 .attr('stroke', 'magenta')
                                 .attr('stroke-width', 2)
                                 .attr('fill', 'none')
                                 .attr('class', 'path');
    },
    // Set start point
    setStartPoint: function(i, j) {
        if(this.start_point){
            const old_i = this.start_point.i;
            const old_j = this.start_point.j;
            this.changeType(old_i, old_j, Types.free);
        }
        this.changeType(i, j, Types.start_point);
        this.start_point = this.arr[i][j];
    },
    // set end point
    setEndPoint: function(i, j) {
        if (this.end_point) {
            const old_i = this.end_point.i;
            const old_j = this.end_point.j;
            this.changeType(old_i, old_j, Types.free);
        }
        this.changeType(i, j, Types.end_point);
        this.end_point = this.arr[i][j];
    },
    // Get rect
    getRect: function(i, j) {
        return this.arr[i][j].rect;
    },
    getType: function(i, j) {
        return this.arr[i][j].type;
    },
    // Chanages the type of the rect
    changeType: function(i, j, t) {
        let rect = this.arr[i][j];
        if (rect.type == t) return;
        rect.type = t;
        rect.rect
            .transition()
            .duration(Styles[t].duration)
            .style('fill', Styles[t].fill);
    },
    // Convert cords from windows to grid
    convertToWindowCords: function(grid_cords) {
        return grid_cords * this.tile_size;
    },
    // Convert cords from grid to windows
    convertToGridCords: function(window_cords) {
        return Math.floor(window_cords / this.tile_size);
    }
};