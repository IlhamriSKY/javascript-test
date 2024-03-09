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
        var ctx = document.getElementById(this.container).getContext('2d');
        // For debugging, where Chart.js will display positive data for the X-axis
        var adjustedValues = data.yValues.map(function (value) {
            // return Math.abs(value);
            return value;
        });
        // Contains data from the beam analysis calculation
        const valueData = {
            labels: data.xValues,
            datasets: [{
                data: adjustedValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
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
                    }
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                        min: -100,
                        max: 100,
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
