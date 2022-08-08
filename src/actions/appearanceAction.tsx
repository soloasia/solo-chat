export const appearance = (appearance: any) => {
    return async (dispatch: any) => {
        dispatch({ type: 'LOAD_APPEARANCE', appearance });
    }
}

export const textSize = (size: any) => {
    return async (dispatch: any) => {
        dispatch({ type: 'LOAD_TEXT_SIZE', size });
    }
}