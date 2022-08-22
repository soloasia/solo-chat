const LOAD_GROUPCHAT = 'LOAD_GROUPCHAT';
export const Contact = (
    state = null,
    action: { type: any; data: any[]; error: any },
) => {
    switch (action.type) {
        case LOAD_GROUPCHAT:
            return action.data;
        case 'GROUPCHAT_ERROR':
            return action.error;
        default:
            return state;
    }
};
