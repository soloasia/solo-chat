const LOAD_CONTACT = 'LOAD_CONTACT';
export const Contact = (
  state = null,
  action: {type: any; data: any[]; error: any},
) => {
  switch (action.type) {
    case LOAD_CONTACT:
      return action.data;
    case 'CONTACT_ERROR':
      return action.error;
    default:
      return state;
  }
};
