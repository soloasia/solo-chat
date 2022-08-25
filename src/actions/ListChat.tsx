const LOAD_LIST_CHAT = 'LOAD_LIST_CHAT';
export const loadListChat = (data: any) => {
  return (dispatch: any) => {
    dispatch({type: LOAD_LIST_CHAT, data});
  };
};
