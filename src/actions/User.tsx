const LOAD_USER = 'LOAD_USER';
export const loadUser = (user: any) => {
  return (dispatch: any) => {
    dispatch({type: LOAD_USER, user});
  };
};
