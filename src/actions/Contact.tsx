const LOAD_CONTACT = 'LOAD_CONTACT';
export const loadContact = (data: any) => {
  return (dispatch: any) => {
    dispatch({type: LOAD_CONTACT, data});
  };
};
