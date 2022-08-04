import { combineReducers } from "redux";
import Language from "./Language";

const LoadingStyles = (
    state = [],
    action: {type: any; style: any; error: any},
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

const rootReducers = combineReducers({
    no_connection: noConnection,
    style: LoadingStyles,
    lang: Language,
});

export type ReducerState = ReturnType<typeof rootReducers>
export default rootReducers;