const LOAD_CONTACT = 'LOAD_CONTACT';
export const loadContact = (data: any) => {
  console.log("data",data);
  return (dispatch: any) => {
    dispatch({type: LOAD_CONTACT, data});
  };
};
