// Controler for the project
var Controler = {
    init: function() {
        this.current_state = States.default;

        this.max_path_finding_speed = 50;
        this.path_finding_speed = 25;

        this.block_interaction = false;
        this.stop_path_finding = false;
        this.cancel_path_finding = false;

        this.bindCallbacks();

        Grid.setStartPoint(0, 0);
        Grid.setEndPoint(1, 1);
    },
    // Bind all callbacks
    bindCallbacks() {
        d3.selectAll('.rect')
          .on('mousedown', this.mouseDown.bind(this))
          .on('mouseover', this.mouseOver.bind(this))
          .on('mouseup', this.mouseUp.bind(this));
        d3.select('#speed')
          .on('change', this.changeSpeed.bind(this));
    },


    // Get state of the project
    getState: function() {
        return this.current_state;
    },
    // Change state of the project
    changeState: function(state) {
        const previous_state = this.current_state;
        const current_state = this.current_state = state;

        switch (previous_state) {
            case States.path_building_end:
                Grid.clearChecked();
                break;
            case States.path_building_canceled:
                Grid.clearChecked();
                break;
        };

        switch (current_state) {
            case States.path_building_start:
                this.blockInteraction(true);
                Grid.clearChecked();
                this.changeState(States.path_building);
                break;
            case States.path_building_end:
                this.blockInteraction(false);
                break;
        };
    },


    // Start path finding
    startPathFinding: async function() {
        this.changeState(States.path_building_start);
        Panel.startPathFinding();

        let algo = Panel.getAlgo();
        await algo();

        if (PathFinder.isSuccess()){
            const path = PathFinder.getPath();
            Grid.buildPath(path);
        }

        Panel.endPathFinding();
        this.changeState(States.path_building_end);
    },
    // Stop path finding
    stopPathFinding: function() {
        Panel.stopPathFinding();
        this.changeState(States.path_building_stopped);
    },
    // Continue path finding
    continuePathFinding: function() {
        Panel.continuePathFinding();
        this.changeState(States.path_building);
    },
    // Cancel path Finding, use after stopPathFinding
    cancelPathFinding: function() {
        Panel.cancelPathFinding();
        this.changeState(States.path_building_canceled);
    },
    //  Control block_interaction flag
    blockInteraction: function(b = true) {
        this.block_interaction = b;
    },


    // MouseDown callback for rect
    mouseDown: function(event) {
        if (this.block_interaction) return;
        const i = Grid.convertToGridCords(event.pageY);
        const j = Grid.convertToGridCords(event.pageX);
        const rect_type = Grid.getType(i, j);

        if (rect_type == Types.free){
            Grid.changeType(i, j, Types.blocked);
            this.changeState(States.put_wall);
        }
        else if (rect_type == Types.blocked) {
            Grid.changeType(i, j, Types.free);
            this.changeState(States.erase_wall);
        }
        else if (rect_type == Types.start_point)
            this.changeState(States.drag_start_point);
        else if (rect_type == Types.end_point)
            this.changeState(States.drag_end_point);
        
    },
    // MouseOver callback for rect
    mouseOver: function(event) {
        if (this.block_interaction) return;
        const i = Grid.convertToGridCords(event.pageY);
        const j = Grid.convertToGridCords(event.pageX);

        const rect_type = Grid.getType(i, j);
        if (this.current_state == States.put_wall && 
            rect_type == Types.free){
            Grid.changeType(i, j, Types.blocked);
        }
        else if (this.current_state == States.erase_wall && 
                 rect_type == Types.blocked){
            Grid.changeType(i, j, Types.free);
        }
        else if (this.current_state == States.drag_start_point && 
                 rect_type == Types.free) {
            Grid.setStartPoint(i, j);
        }
        else if (this.current_state == States.drag_end_point &&
                 rect_type == Types.free) {
            Grid.setEndPoint(i, j);
        }
    },
    // MouseUp callback for rect
    mouseUp: function(event) {
        if (this.block_interaction) return;
        this.changeState(States.default);
    },
    // Change speed callback of path finding
    changeSpeed: function(event) {
        this.path_finding_speed = this.max_path_finding_speed - event.target.value;
        console.log(this.path_finding_speed);
    }
}