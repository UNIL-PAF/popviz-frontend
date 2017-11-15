import {port, hostname, urlPrefix} from '../../config'

 let loadProteinFromBackend = (proteinAC, proteinLoadedCB, stopLoadingProtCB) => {
    if(proteinAC){
        fetch(`http://` + hostname + `:` + port + urlPrefix + `/protein/` + proteinAC)
            .then(function(response) {
                if(response.status === 404){
                    alert('Protein [' + proteinAC + '] was not found')
                    stopLoadingProtCB()
                    return null
                }
                else if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

                return response.json();
            })
            .then(function(data) {
                if(data) proteinLoadedCB(data);
            });
    }
}

export { loadProteinFromBackend }