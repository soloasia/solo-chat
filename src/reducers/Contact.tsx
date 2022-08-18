const LOAD_CONTACT = 'LOAD_CONTACT';
export const Contact = (
  state = null,
  action: {type: any; user: any[]; error: any},
) => {
  switch (action.type) {
    case LOAD_CONTACT:
      return action.user;
    case 'CONTACT_ERROR':
      return action.error;
    default:
      return state;
  }
};
