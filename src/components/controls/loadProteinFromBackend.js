import {port, hostname, urlPrefix} from '../../config'

 let loadProteinFromBackend = (proteinAC, proteinLoadedCB) => {

    fetch(`http://` + hostname + `:` + port + urlPrefix + `/protein/` + proteinAC)
        .then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(data) {
            proteinLoadedCB(data);
        });
}

export { loadProteinFromBackend }