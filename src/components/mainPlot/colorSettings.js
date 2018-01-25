import { scaleLinear } from 'd3-scale';
import { schemeCategory20 } from 'd3-scale';
import * as _ from 'lodash';

// prepare the color range for the ratios
let ratioColorScale = scaleLinear().domain([-2, 0, 2]).range(["green", "lightgrey", "red"]);


// prepare the colors for the samples
// we take first the dark colors from "schemeCategory20" and afterwards the lighter ones
const colorSchemeArray = _.range(0, 19, 2).concat(_.range(1, 20, 2))
let sampleColor = (sampleIdx) => { return schemeCategory20[colorSchemeArray[sampleIdx]] }

export { ratioColorScale, sampleColor }