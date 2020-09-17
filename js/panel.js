function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let Panel = {
    init: function() {
        this.stop_path_finding = false;
        this.btnClear = d3.select('.btn-clear');
        this.btnStartContinue = d3.select('.btn-start-continue');
        this.btnStopCancel = d3.select('.btn-stop-cancel');
        this.bindCallbacks();

        this.deactivateStopCancel();
    },
    // binds all callbacks
    bindCallbacks: function() {
        // Clear grid button
        this.btnClear
            .on('click', Grid.clearGrid.bind(Grid));
        // Start path finding button
        this.btnStartContinue
            .on('click', this.startContinueCallback.bind(this));
        // Stop and cancel
        this.btnStopCancel
            .on('click', this.stopCancelCallback.bind(this));
    },
    // Start-continue button callback
    startContinueCallback: function() {
        switch (this.btnStartContinue.text()) {
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
        switch (this.btnStopCancel.text()) {
            case 'Stop':
                Controler.stopPathFinding();
                break;
            case 'Cancel':
                Controler.cancelPathFinding();
                break;
        };
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
        this.btnStartContinue
            .text(string);
    },
    renameStopCancel: function(string) {
        this.btnStopCancel
            .text(string);
    },
    // activate clear button
    activateClear: function() {
        this.btnClear
            .property('disabled', false);
    },
    // Activate start-continuer button
    activateStartContinue: function() {
        this.btnStartContinue
            .property('disabled', false);
    },
    // Activate stop-cancel button
    activateStopCancel: function() {
        this.btnStopCancel
            .property('disabled', false);
    },
    // Deactivate clear button
    deactivateClear: function() {
        this.btnClear
            .property('disabled', true);
    },
    // Deactivate start-continue button
    deactivateStartContinue: function() { 
        this.btnStartContinue
            .property('disabled', true); 
    },
    // Deactivate stop-cancel button
    deactivateStopCancel: function() {
        this.btnStopCancel
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