const LOAD_LIST_CHAT = 'LOAD_LIST_CHAT';
export const ListChat = (
  state = null,
  action: {type: any; data: any[]; error: any},) => { 
  switch (action.type) {
    case LOAD_LIST_CHAT:
      return action.data;
    case 'LOAD_LIST_CHAT_ERROR' :
      return action.error;
    default:
      return state;
  }
};
