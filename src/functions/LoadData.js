import { loadContact } from "../actions/Contact";
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
}
