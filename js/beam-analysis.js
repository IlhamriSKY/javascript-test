'use strict';
/** ============================ Beam Analysis Data Type ============================ */
/**
 * Beam material specification.
 *
 * @param {String} name         Material name
 * @param {Object} properties   Material properties {EI : 0, GA : 0, ....}
 */
function Material(name, properties) {
    this.name = name;
    this.properties = properties;
}
/**
 *
 * @param {Number} primarySpan          Beam primary span length
 * @param {Number} secondarySpan        Beam secondary span length
 * @param {Material} material           Beam material object
 */
function Beam(primarySpan, secondarySpan, material) {
    this.primarySpan = primarySpan;
    this.secondarySpan = secondarySpan;
    this.material = material;
}
/** ============================ Beam Analysis Class ============================ */
function BeamAnalysis() {
    this.options = {
        condition: 'simply-supported'
    };
    this.analyzer = {
        'simply-supported': new BeamAnalysis.analyzer.simplySupported(),
        'two-span-unequal': new BeamAnalysis.analyzer.twoSpanUnequal()
    };
}
BeamAnalysis.prototype = {
    /**
     *
     * @param {Beam} beam
     * @param {Number} load
     */
    getDeflection: function (beam, load, condition) {
        var analyzer = this.analyzer[condition];
        if (analyzer) {
            var equation = analyzer.getDeflectionEquation(beam, load);
            // Generate x and y values for the plot
            var xValues = [];
            var yValues = [];
            var getX = 0;
            if (condition == 'simply-supported') {
                for (var x = 1; x <= beam.primarySpan; x += 1) {
                    xValues.push(getX);
                    yValues.push(equation(getX).y);
                    getX = getX + beam.primarySpan / 10;
                }
            } else {
                let x = 0;
                let condition = true;
                while (condition) {
                    const L1 = beam.primarySpan;
                    const L2 = beam.secondarySpan;
                    const total = L1 + L2;
                    const M1 = -((load * Math.pow(L2, 3)) + (load * Math.pow(L1, 3))) / (8 * (L1 + L2));
                    const R1 = (M1 / L1) + ((load * L1) / 2);
                    const R3 = (M1 / L2) + ((load * L2) / 2);
                    const getX1 = getX;
                    const getX2 = (xValues[x - 1] || 0);
                    xValues.push(parseFloat(getX.toFixed(3)));
                    yValues.push(equation(getX).y);
                    if (getX1 === 0) {
                        getX = getX1 + total / 10;
                    } else if (Math.abs(getX1 - L1) <= total / 10 && getX1 - L1 < 0) {
                        getX = L1;
                    } else if (getX1 < L1 && getX1 !== R1 / load && getX2 !== R1 / load && Math.abs(getX1 - R1 / load) <= total / 10 && x !== 3) {
                        getX = R1 / load;
                    } else if (Math.abs(getX1 - total) < total / 10) {
                        getX = total;
                    } else if (getX1 > L1 && getX1 !== total - (R3 / load) && getX2 !== total - (R3 / load) && Math.abs(getX1 - (total - (R3 / load))) < total / 10 && x !== 11) {
                        getX = total - (R3 / load);
                    } else if (getX1 === R1 / load || getX1 === total - (R3 / load)) {
                        getX = getX2 + total / 10;
                    } else {
                        getX = getX1 + total / 10;
                    }
                    x++;
                    if (xValues[x - 1] >= total) {
                        condition = false;
                    }
                }
            }
            // console.log(xValues);
            // console.log(yValues);
            return {
                xValues: xValues,
                yValues: yValues
            };
        } else {
            throw new Error('Invalid condition');
        }
    },
    getBendingMoment: function (beam, load, condition) {
        var analyzer = this.analyzer[condition];
        if (analyzer) {
            var equation = analyzer.getBendingMomentEquation(beam, load);
            // Generate x and y values for the plot
            var xValues = [];
            var yValues = [];
            let getX = 0;
            if (condition == 'simply-supported') {
                for (var x = 1; x <= beam.primarySpan; x += 1) {
                    xValues.push(getX);
                    yValues.push(equation(getX).y);
                    getX = getX + beam.primarySpan / 10;
                }
            } else {
                let x = 0;
                let condition = true;
                while (condition) {
                    const L1 = beam.primarySpan;
                    const L2 = beam.secondarySpan;
                    const total = L1 + L2;
                    const M1 = -((load * Math.pow(L2, 3)) + (load * Math.pow(L1, 3))) / (8 * (L1 + L2));
                    const R1 = (M1 / L1) + ((load * L1) / 2);
                    const R3 = (M1 / L2) + ((load * L2) / 2);
                    const getX1 = getX;
                    const getX2 = (xValues[x - 1] || 0);
                    xValues.push(parseFloat(getX.toFixed(3)));
                    yValues.push(equation(getX).y);
                    if (getX1 === 0) {
                        getX = getX1 + total / 10;
                    } else if (Math.abs(getX1 - L1) <= total / 10 && getX1 - L1 < 0) {
                        getX = L1;
                    } else if (getX1 < L1 && getX1 !== R1 / load && getX2 !== R1 / load && Math.abs(getX1 - R1 / load) <= total / 10 && x !== 3) {
                        getX = R1 / load;
                    } else if (Math.abs(getX1 - total) < total / 10) {
                        getX = total;
                    } else if (getX1 > L1 && getX1 !== total - (R3 / load) && getX2 !== total - (R3 / load) && Math.abs(getX1 - (total - (R3 / load))) < total / 10 && x !== 11) {
                        getX = total - (R3 / load);
                    } else if (getX1 === R1 / load || getX1 === total - (R3 / load)) {
                        getX = getX2 + total / 10;
                    } else {
                        getX = getX1 + total / 10;
                    }
                    x++;
                    if (xValues[x - 1] >= total) {
                        condition = false;
                    }
                }
            }
            // console.log(xValues);
            // console.log(yValues);
            return {
                xValues: xValues,
                yValues: yValues
            };
        } else {
            throw new Error('Invalid condition');
        }
    },
    getShearForce: function (beam, load, condition) {
        var analyzer = this.analyzer[condition];
        if (analyzer) {
            var equation = analyzer.getShearForceEquation(beam, load);
            // Generate x and y values for the plot
            var xValues = [];
            var yValues = [];
            let getX = 0;
            if (condition == 'simply-supported') {
                for (getX = 0; getX <= beam.primarySpan;) {
                    xValues.push(getX);
                    yValues.push(equation(getX).y);
                    getX = getX + beam.primarySpan / 10;
                }
            } else {
                let x = 0;
                let condition = true;
                while (condition) {
                    const L1 = beam.primarySpan;
                    const L2 = beam.secondarySpan;
                    const total = L1 + L2;
                    const getX1 = getX;
                    const getX2 = (xValues[x - 1] || 0);
                    xValues.push(parseFloat(getX.toFixed(1)));
                    yValues.push(equation(getX, getX2).y);
                    if (getX1 === 0) {
                        getX = getX1 + total / 10;
                    } else if (Math.abs(getX1 - L1) <= (total / 10) && (getX1 - L1) < 0) {
                        getX = L1;
                    } else if ((getX1 - L1) === 0 && Math.abs(getX2 - L1) <= (total / 10) && (getX1 !== L1 || x === 5)) {
                        getX = L1;
                    } else if (Math.abs(getX1 - total) < total / 10) {
                        getX = total;
                    } else {
                        getX = getX1 + (total / 10);
                    }
                    x++;
                    if (xValues[x - 1] >= total) {
                        condition = false;
                    }
                }
            }
            // console.log(xValues);
            // console.log(yValues);
            return {
                xValues: xValues,
                yValues: yValues
            };
        } else {
            throw new Error('Invalid condition');
        }
    },
};
/** ============================ Beam Analysis Analyzer ============================ */
/**
 * Available analyzers for different conditions
 */
BeamAnalysis.analyzer = {};
/**
 * Calculate deflection, bending stress and shear stress for a simply supported beam
 *
 * @param {Beam}   beam   The beam object
 * @param {Number}  load    The applied load
 */
BeamAnalysis.analyzer.simplySupported = function (beam, load) {
    this.beam = beam;
    this.load = load;
};
// Simply Supported UDL Analyzer
BeamAnalysis.analyzer.simplySupported.prototype = {
    getShearForceEquation: function (beam, load) {
        return function (x) {
            const shearForce = load * (beam.primarySpan / 2 - x);
            return {
                x: x,
                y: Math.round(shearForce)
            };
        };
    },
    getBendingMomentEquation: function (beam, load) {
        return function (x) {
            const bendingMoment = -((load * x / 2) * (beam.primarySpan - x));
            return {
                x: x,
                y: Math.round(bendingMoment)
            };
        };
    },
    getDeflectionEquation: function (beam, load) {
        const L = beam.primarySpan;
        const EI = beam.material.properties.EI / Math.pow(1000, 3);  // Convert EI to kN-m2
        const j2 = beam.j2;
        return function (x) {
            const deflection = -((load * x) / (24 * EI)) * (Math.pow(L, 3) - 2 * L * Math.pow(x, 2) + Math.pow(x, 3)) * j2 * 1000;
            return {
                x: x,
                y: Math.round(deflection)
            };
        };
    },
};
/**
 * Calculate deflection, bending stress and shear stress for a beam with two spans of equal condition
 *
 * @param {Beam}   beam   The beam object
 * @param {Number}  load    The applied load
 */
BeamAnalysis.analyzer.twoSpanUnequal = function (beam, load) {
    this.beam = beam;
    this.load = load;
};
// Two Unequal Span Equal UDL Analyzer
BeamAnalysis.analyzer.twoSpanUnequal.prototype = {
    getDeflectionEquation: function (beam, load) {
        return function (x) {
            let y = 0;
            const L1 = beam.primarySpan;
            const L2 = beam.secondarySpan;
            const EI = beam.material.properties.EI;
            const M1 = -((load * Math.pow(L2, 3)) + (load * Math.pow(L1, 3))) / (8 * (L1 + L2));
            const R1 = (M1 / L1) + ((load * L1) / 2);
            const j2 = beam.j2;
            y = (x / (24 * (EI / Math.pow(1000, 3))) * ((4 * R1 * (Math.pow(x, 2))) - (load * (Math.pow(x, 3))) + (load * (Math.pow(L1, 3))) - (4 * R1 * (Math.pow(L1, 2))))) * 1000 * j2;
            y = (x / (24 * (EI / Math.pow(1000, 3)))) * ((4 * R1 * (Math.pow(x, 2))) - (load * (Math.pow(x, 3))) + (load * (Math.pow(L1, 3))) - (4 * R1 * (Math.pow(L1, 2)))) * 1000 * j2;
            return {
                x: x,
                y: y.toFixed(8)
            };
        };
    },
    getBendingMomentEquation: function (beam, load) {
        function roundToTwoDecimalPlaces(value) {
            return Math.round(value * 100) / 100;
        }
        return function (x) {
            let y = 0;
            const L1 = beam.primarySpan;
            const L2 = beam.secondarySpan;
            const total = L1 + L2;
            const M1 = -((load * Math.pow(L2, 3)) + (load * Math.pow(L1, 3))) / (8 * (L1 + L2));
            const R1 = (M1 / L1) + ((load * L1) / 2);
            const R3 = (M1 / L2) + ((load * L2) / 2);
            const R2 = (load * L1) + (load * L2) - R1 - R3;
            if (x === 0 || x === total) {
                y = roundToTwoDecimalPlaces(0);
            } else if (x < L1) {
                y = roundToTwoDecimalPlaces(-(R1 * x - 0.5 * load * Math.pow(x, 2)));
            } else if (x > L1) {
                y = roundToTwoDecimalPlaces(-((R1 * x + R2 * (x - L1)) - 0.5 * load * Math.pow(x, 2)));
            } else {
                y = roundToTwoDecimalPlaces(-(R1 * L1 - 0.5 * load * Math.pow(L1, 2)));
            }
            return {
                x: x,
                y: y.toFixed(2)
            };
        };
    },
    getShearForceEquation: function (beam, load) {
        return function (x, x2) {
            let y = 0;
            const L1 = beam.primarySpan;
            const L2 = beam.secondarySpan;
            const total = L1 + L2;
            const M1 = -((load * Math.pow(L2, 3)) + (load * Math.pow(L1, 3))) / (8 * (L1 + L2));
            const R1 = (M1 / L1) + ((load * L1) / 2);
            const R3 = (M1 / L2) + ((load * L2) / 2);
            const R2 = (load * L1) + (load * L2) - R1 - R3;
            if (x === 0) {
                y = R1;
            } else if (x === total) {
                y = (R1 + R2) - (load * total);
            } else if (x === L1 && x2 - L1 < 0) {
                y = R1 - (load * L1);
            } else if (x === L1 && x2 - L1 > 0) {
                y = (R1 + R2) - (load * L1);
            } else if (x < L1) {
                y = R1 - (load * x);
            } else {
                y = (R1 + R2) - (load * x);
            }
            return {
                x: x,
                y: y.toFixed(2)
            };
        };
    }
};
