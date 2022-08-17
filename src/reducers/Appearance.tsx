const Appearance = (state = [], action: { type: any; appearance: any[]; error: any; }) => {
    switch (action.type) {
        case 'LOAD_APPEARANCE':
            return action.appearance;
        case 'LOAD_APPEARANCE__ERROR':
            return action.error;
        default:
            return state;
    }
}
export default Appearance;