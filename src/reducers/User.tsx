const LOAD_USER = 'LOAD_USER';
export const User = (
  state = null,
  action: {type: any; user: any[]; error: any},
) => {
  switch (action.type) {
    case LOAD_USER:
      return action.user;
    case 'USER_ERROR':
      return action.error;
    default:
      return state;
  }
};
