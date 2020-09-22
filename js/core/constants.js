// constants.js - main constants of the project

// Types of the cells
let Types = {
    free: 0,
    blocked: 1,
    start_point: 2,
    end_point: 3,
    checked: 4,
    cur_checked: 5
};

// States of the project
let States = {
    default: 0,
    put_wall: 1,
    erase_wall: 2,
    drag_start_point: 3,
    drag_end_point: 4,
    path_building_start: 5,
    path_building: 6,
    path_building_stopped: 7,
    path_building_canceled: 8,
    path_building_end: 9,
};

// Styles of the cells,
// the number in the array corresponds to the type number
let Styles = [
    {   // 0 : free
        fill: 'white',
        duration: 0
    },
    {   // 1 : blocked
        fill: 'grey',
        duration: 0
    },
    {   // 2 : start point
        fill: '#62D86A',
        duration: 0
    },
    {   // 3 : end point
        fill: '#D53A34',
        duration: 0
    },
    {   // 4 : checked
        fill: '#8DE5FF',
        duration: 100
    },
    {   // 5 : current checked
        fill: '#FDDD5A',
        duration: 100
    }
];