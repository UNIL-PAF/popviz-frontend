// adapt following to match target backend server
const hostname = 'localhost';
const port = '3001';
// const port = '8888';
const urlPrefix = '';
// const urlPrefix = '/slimp/public';

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