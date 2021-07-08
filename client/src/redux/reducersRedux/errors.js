const initialzeState = {
    type: null,
    msg: '',
}

const errorsReducer = (state = initialzeState, action) => {

    switch (action.type) {

        case 'SET_ERROR':
            state.type = action.payload.typed
            state.msg = action.payload.msg
            return { ...state };

        default:
            return state;
    }
}

export default errorsReducer;