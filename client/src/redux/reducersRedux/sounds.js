const initialzeState = {
    active: false,
    src: null,
    sounds: []
}


const soundReducer = (state = initialzeState, action) => {

    switch (action.type) {

        case 'TOGGLE_SOUND':
            state.active = !state.active
            return { ...state };

        case 'SET_BG_SOUND':
            state.src = action.payload.sound
            return { ...state };

        case 'ADD_TIMER_SOUND':
            state.sounds = [...state.sounds, action.payload.sound]
            return { ...state };

        default:
            return state;

    }
}

export default soundReducer;