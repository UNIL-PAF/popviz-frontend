import {urlBackend} from '../../config'
import * as _ from 'lodash';

 let loadProteinFromBackend = (proteinAC, proteinLoadedCB, stopLoadingProtCB) => {
    if(proteinAC){
        fetch(urlBackend + `/protein/` + proteinAC, {
            credentials: 'same-origin'
        })
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
                if(data){
                    if(proteinAC !== data.proteinAC) {
                        // in this case we remove the cleavages
                        delete data.cleavages

                        // we only keep experiments which do contain the selected proteinAC
                        const filteredSamples = _.pickBy(data.samples, (s) => {
                            return s.proteinIDs.includes(proteinAC)
                        });

                        data.samples = filteredSamples

                        // filter the peptides
                        const validSamples = Object.keys(filteredSamples)

                        const filteredPeps = _.filter(data.peptides, (p) => {
                            return validSamples.includes(p.sampleName)
                        })

                        data.peptides = filteredPeps
                    }

                    loadDescripionsFromBackend(proteinAC, proteinLoadedCB, stopLoadingProtCB, data)
                }

            });
    }
}


let remapPeptides = (sequence, peptides, onlyUndefined) => {
    const remappedPeps = _.map(peptides, (p) => {

        // incase we only want to remap the undefined peptides
        if(onlyUndefined && peptides.startPos) return p

        const pepPos = sequence.indexOf(p.sequence)
        if(pepPos < 0) return null
        p.startPos = pepPos + 1
        p.endPos = pepPos + p.sequence.length

        if(p.aminoAcidBefore){
            p.aminoAcidBefore = sequence.charAt(p.startPos - 2)
            p.aminoAcidAfter = sequence.charAt(p.endPos)
        }

        return p
    })
    return _.filter(remappedPeps, (p) => {return p})
}

let loadFastaFromBackend = (proteinAC, proteinLoadedCB, stopLoadingProtCB, data, descriptions) => {
    fetch(urlBackend + `/fasta/` + proteinAC, {
        credentials: 'same-origin'
    })
        .then(function(response) {
            if(response.status === 404){
                alert('Fasta entry for protein [' + proteinAC + '] was not found')
                stopLoadingProtCB()
                return null
            }
            else if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(fasta) {
            if(fasta){
                data.sequence = fasta.seq
                data.sequenceLength = fasta.seq.length

                // try to remap the peptides if it's another protein
                const onlyUndefined = (proteinAC === data.proteinAC)

                data.peptides = remapPeptides(data.sequence, data.peptides, onlyUndefined)

                // we have to do the same for the peptides in the samples
                _.mapValues(data.samples, (s) => {
                    const samplePeps = remapPeptides(data.sequence, s.peptideSequences, onlyUndefined)
                    s.nrPeptides = samplePeps.length

                    return s
                })

                // take the theoretical weight from the fasta if it is not the first protein
                if(proteinAC !== data.proteinAC){
                    data.theoMolWeight = fasta.theoMolWeight
                    data.theoMolWeightLog10 = fasta.theoMolWeightLog10
                   }

                proteinLoadedCB(data);
            }
        });
}

let loadDescripionsFromBackend = (proteinAC, proteinLoadedCB, stopLoadingProtCB, data) => {
     const proteinACs = data.alternativeProteinACs.join(",")

    fetch(urlBackend + `/descriptions/` + proteinACs, {
        credentials: 'same-origin'
    })
        .then(function(response) {
            if(response.status === 404){
                alert('Description for proteins [' + proteinACs + '] was not found')
                stopLoadingProtCB()
                return null
            }
            else if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(desc) {
            if(desc){
                const descSorted = _.map(data.alternativeProteinACs, (p) => {
                    const res = _.find(desc, (d) => {return d.ac === p})
                    if(typeof res !== 'undefined'){
                        res.selected = (res.ac === proteinAC) ? true : false
                    }
                    return res;
                })

                const descFlt = _.filter(descSorted, (d) => { return d})

                data.descriptions = descFlt;

                if(proteinAC !== data.proteinAC) {
                    // set the new proteinAC and geneName
                    data.proteinAC = proteinAC
                    data.geneName = _.find(desc, (d) => {return d.ac === proteinAC}).gene_name
                }

                data.isBestHit = _.findIndex(descFlt, (d) => {return d.selected}) === 0

                loadFastaFromBackend(proteinAC, proteinLoadedCB, stopLoadingProtCB, data);
            }
        });
}

export { loadProteinFromBackend }