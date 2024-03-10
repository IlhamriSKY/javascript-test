'use strict';

/**
 * Plot result from the beam analysis calculation into a graph
 */
// analysis-plotter.js
function AnalysisPlotter(container) {
    this.container = container;
}
AnalysisPlotter.prototype = {
    plot: function (data, chartName) {

        // console.log(data);

        var ctx = document.getElementById(this.container).getContext('2d');

        // Add +1 to each value on the X-axis
        var adjustedXValues = data.xValues.map(function (value) {
            return value + 1;
        });

        // For debugging, where Chart.js will display positive data for the X-axis
        var adjustedValues = data.yValues.map(function (value) {
            // return Math.abs(value);
            return value;
        });

        // Contains data from the beam analysis calculation
        const valueData = {
            labels: adjustedXValues,
            datasets: [{
                data: adjustedValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Span (m)'
                    },
                    max: Math.max(...adjustedXValues) + 1 // Set the maximum X-axis value dynamically
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 20,
                        max: 100,
                        min: -100,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: chartName,
                    position: 'left'
                },
                legend: {
                    display: false
                }
            },
        };

        // Create a new chart with updated data and options
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: valueData,
            options: options
        });
    },
};
