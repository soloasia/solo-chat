import { loadContact } from "../actions/Contact";
import { loadListChat } from "../actions/ListChat";
import { GET } from "./BaseFuntion";

export function loadData(dispatch) {
    GET(`me/contact?page=1`)
    .then(async (result) => {
        if(result.status){
            dispatch(loadContact(result.data.data))
        }
    })
    .catch(e => {
    });
    GET(`me/chatrooms?page=1&per_page=20`)
    .then(async (result) => {
        if(result.status) {
            dispatch(loadListChat(result.data.data))
         }
    })
    .catch(e => {
    });
}


