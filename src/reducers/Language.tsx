const Language = (state = [], action: { type: any; language: any[]; error: any; }) => {
    switch (action.type) {
        case 'LOAD_LANGUAGE':
            return action.language;
        case 'LOAD_LANGUAGE__ERROR':
            return action.error;
        default:
            return state;
    }
}
export default Language;