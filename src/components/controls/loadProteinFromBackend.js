const hostname = "localhost";
const port = "3001"

 let loadProteinFromBackend = (proteinAC, proteinLoadedCB) => {

    fetch(`http://` + hostname + `:` + port + `/protein/` + proteinAC)
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