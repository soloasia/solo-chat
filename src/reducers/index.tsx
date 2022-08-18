import { combineReducers } from "redux";
import Language from "./Language";
import Appearance from './Appearance';
import { User } from "./User";
import { Contact } from "./Contact";

const LoadingStyles = (
  state = [],
  action: { type: any; style: any; error: any },
) => {
  switch (action.type) {
    case 'LOAD_STYLES':
      return action.style;
    case 'LOAD_STYLES_ERROR':
      return action.error;
    default:
      break;
  }
  return state;
};
const noConnection = (state = false, action: { type: any; value: any; error: any; }) => {
  switch (action.type) {
    case 'LOAD_NO_CONNECTION':
      return action.value
    case 'LOAD__NO_CONNECTION_ERROR':
      return action.error;
    default:
      break;
  }
  return state;
}
const textSizeChange = (state = 14, action: { type: any; size: any; error: any; }) => {
  switch (action.type) {
    case 'LOAD_TEXT_SIZE':
      return action.size
    case 'LOAD__TEXT_SIZE_ERROR':
      return action.error;
    default:
      break;
  }
  return state;
}
const mobileToken = (state = [], action: { type: any; value: any; error: any; }) => {
  switch (action.type) {
      case 'LOAD_MOBILE_TOKEN':
          return action.value
      case 'LOAD__LOAD_MOBILE_TOKEN_ERROR':
          return action.error;
      default:
          break;
  }
  return state;
}

const userToken = (state = [], action: { type: any; value: any; error: any; }) => {
  switch (action.type) {
      case 'LOAD_USER_TOKEN':
          return action.value
      case 'LOAD_USER_TOKEN_ERROR':
          return action.error;
      default:
          break;
  }
  return state;
}

const rootReducers = combineReducers({
  no_connection: noConnection,
  style: LoadingStyles,
  lang: Language,
  appearance: Appearance,
  textSizeChange: textSizeChange,
  mobile_token:mobileToken,
  token:userToken,
  user : User,
  mycontact : Contact
});

export type ReducerState = ReturnType<typeof rootReducers>
export default rootReducers;