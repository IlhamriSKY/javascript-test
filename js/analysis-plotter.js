"use strict";

/**
 * Plot result from the beam analysis calculation into a graph
 */
// analysis-plotter.js
function AnalysisPlotter(container) {
    this.container = container;
}
AnalysisPlotter.prototype = {
    plot: function (data, chartName) {
        // Shorting xValues
        function shortData(data){
            let newData = data.xValues.map((value, index) => {
                return { x: value, y: data.yValues[index] };
            });
            newData.sort((a, b) => a.x - b.x);
            let newxValues = newData.map(item => item.x);
            let newyValues = newData.map(item => item.y);

            return {
                xValues: newxValues,
                yValues: newyValues
            };
        }

        data = shortData(data);

        var ctx = document.getElementById(this.container).getContext("2d");

        // For adjust positive or negative value
        var adjustedXValues = data.xValues.map(function (value) {
            return value * 1;
        });

        // For debugging, where Chart.js will display positive data for the X-axis
        var adjustedValues = data.yValues.map(function (value) {
            return value;
        });

        // Contains data from the beam analysis calculation
        const valueData = {
            labels: adjustedXValues,
            datasets: [
                {
                    data: adjustedValues,
                    borderColor: "rgba(253,0,0,1)",
                    backgroundColor: "rgba(253, 192, 192, 0.2)",
                    borderWidth: 1,
                    fill: true,
                    lineTension: 0.4,
                    cubicInterpolationMode: 'monotone',
                    pointRadius: 1,
                    pointStyle: 'circle',
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: 'rgba(253,0,0,1)',
                    pointBorderWidth: 1,
                    hoverRadius: 5,
                    hoverBackgroundColor: 'rgba(253,0,0,1)',
                    hoverBorderColor: 'rgba(253,0,0,1)',
                    hoverBorderWidth: 2,
                    showLine: true,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Span (m)",
                    },
                    ticks: {
                        callback: function (value) {
                            return value;
                        },
                    },
                    max: Math.max(...adjustedXValues) + 1,
                },
                xAxis2: {
                    type: "linear",
                    position: "center",
                    beginAtZero: true,
                    title: {
                        display: false,
                        text: "Span (m)",
                    },
                    ticks: {
                        callback: function (value) {
                            return value;
                        },
                    },
                    max: Math.max(...adjustedXValues) + 1,
                },
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: chartName,
                    position: "left",
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                }
            },
        };

        // Create a new chart with updated data and options
        this.myChart = new Chart(ctx, {
            type: "scatter",
            data: valueData,
            options: options,
        });
    },
};
