import {port, hostname, urlPrefix} from '../../config'

 let loadFastaHeadersFromBackend = (queryString, gotResponseCB) => {

    fetch(`http://` + hostname + `:` + port + urlPrefix + `/query/` + queryString)
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