import {urlBackend} from '../../config'

 let loadFastaHeadersFromBackend = (queryString, gotResponseCB) => {
     fetch(urlBackend + `/query/` + queryString, {
         credentials: 'same-origin'
     })
        .then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(data) {
            gotResponseCB(data);
        });
}

export { loadFastaHeadersFromBackend }