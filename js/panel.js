// Representation of control panel
let Panel = {
    // Initialization function
    init: function() {
        // Path finding flag
        this.stop_path_finding = false;
        
        // Get DOM elements
        this.panel = d3.select('#panel');
        this.panel_drag = d3.select('.panel-drag');
        this.btn_clear = d3.select('.btn-clear');
        this.btn_start_continue = d3.select('.btn-start-continue');
        this.btn_stop_cancel = d3.select('.btn-stop-cancel');
        this.btns_radio = d3.selectAll('input[type=radio]');

        // Algorith for path finding, simple bfs default
        this.algo = PathFinder.breadthFistSearch.bind(PathFinder);

        this.bindCallbacks();

        this.deactivateStopCancel();
    },
    // Binds all callbacks
    bindCallbacks: function() {
        // Clear grid button
        this.btn_clear
            .on('click', Grid.clearGrid.bind(Grid));
        // Start path finding button
        this.btn_start_continue
            .on('click', this.startContinueCallback.bind(this));
        // Stop and cancel
        this.btn_stop_cancel
            .on('click', this.stopCancelCallback.bind(this));
        // Drag pandel
        this.panel_drag
            .on('mousedown', this.mouseDown.bind(this));
        // Choose algorithm
        this.btns_radio
            .on('click', this.radioCallback.bind(this));    
    },
    // Start-continue button callback
    startContinueCallback: function() {
        switch (this.btn_start_continue.text()) {
            case 'Start':
                Controler.startPathFinding();
                break;
            case 'Continue':
                Controler.continuePathFinding();
                break;
        };
    },
    // Stop-cancel button callback
    stopCancelCallback: function() {
        switch (this.btn_stop_cancel.text()) {
            case 'Stop':
                Controler.stopPathFinding();
                break;
            case 'Cancel':
                Controler.cancelPathFinding();
                break;
        };
    },
    // Radio button callback
    radioCallback: function(event) {
        const target = event.currentTarget;
        switch(target.dataset.algo) {
            case 'bfs':
                this.algo = PathFinder.breadthFistSearch.bind(PathFinder);
                break;
            case 'greedy-bfs-manhattan':
                this.algo = PathFinder.greedyBreadthFistSearch.bind(PathFinder, 'manhattan');
                break;
            case 'greedy-bfs-euclidean':
                this.algo = PathFinder.greedyBreadthFistSearch.bind(PathFinder, 'euclidean');
                break;
            case 'astar-manhattan':
                this.algo = PathFinder.aStar.bind(PathFinder, 'manhattan');
                break;
            case 'astar-euclidean':
                this.algo = PathFinder.aStar.bind(PathFinder, 'euclidean');
                break;
        }
    },
    // Returns algo to path finding
    getAlgo: function() {
        return this.algo;
    },
    // Drag panel callback
    mouseDown: function(event) {
        this.flag_panel_drag = true;
        this.posX = event.clientX;
        this.posY = event.clientY;
        document.onmousemove = this.mouseMove.bind(this);
        document.onmouseup = this.mouseUp.bind(this);
    },
    // Panel move callback
    mouseMove: function(event) {
        if (!this.flag_panel_drag) return;
        const x = parseInt(this.panel.style('right')) + (this.posX - event.pageX);
        const y = parseInt(this.panel.style('top')) + (event.pageY - this.posY);
        this.panel
            .style('top', `${y}px`)
            .style('right', `${x}px`);
        this.posX = event.pageX;
        this.posY = event.pageY;
    },
    // Panel stay callback
    mouseUp: function() {
        this.flag_panel_drag = false;
        document.onmousemove = null;
        document.onmouseup = null;
    },


    // Buttons behavior when start path finding
    startPathFinding: function() {
        this.deactivateClear();
        this.deactivateStartContinue();
        this.activateStopCancel();
    },
    // Button behavior when stop path finding 
    stopPathFinding: function() {
        this.renameStartContinue('Continue');
        this.renameStopCancel('Cancel');

        this.activateStartContinue();
    },
    // Buttons behavior when cancel path finding
    cancelPathFinding: function() {
        this.toDefault();
    },
    // Buttons behavior when continuer
    continuePathFinding: function() {
        this.renameStartContinue('Start');
        this.renameStopCancel('Stop');
        this.deactivateStartContinue();
    },
    // Buttons behavior when end path finding
    endPathFinding: function() {
        this.toDefault();
    },


    // Renames startContinue button
    renameStartContinue: function(string) {
        this.btn_start_continue
            .text(string);
    },
    renameStopCancel: function(string) {
        this.btn_stop_cancel
            .text(string);
    },
    // activate clear button
    activateClear: function() {
        this.btn_clear
            .property('disabled', false);
    },
    // Activate start-continuer button
    activateStartContinue: function() {
        this.btn_start_continue
            .property('disabled', false);
    },
    // Activate stop-cancel button
    activateStopCancel: function() {
        this.btn_stop_cancel
            .property('disabled', false);
    },
    // Deactivate clear button
    deactivateClear: function() {
        this.btn_clear
            .property('disabled', true);
    },
    // Deactivate start-continue button
    deactivateStartContinue: function() { 
        this.btn_start_continue
            .property('disabled', true); 
    },
    // Deactivate stop-cancel button
    deactivateStopCancel: function() {
        this.btn_stop_cancel
            .property('disabled', true);
    },
    // Sets all button to default
    toDefault: function() {
        this.activateStartContinue();
        this.activateClear();

        this.deactivateStopCancel();

        this.renameStartContinue('Start');
        this.renameStopCancel('Stop');
    },
}