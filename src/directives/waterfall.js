(function () {
    'use strict';

    angular.module('myApp.directives')
        .directive('d3Waterfall', [function () {
            return {
                restrict: 'EA',
                scope: {
                    data: "=",
                    label: "@",
                    onClick: "&"
                },
                link: function (scope, iElement, iAttrs) {

                    // initialise svg and binds it to DOM
                    var svg = d3.select(iElement[0])
                        .append("svg")


                    // watch for changes in parent element size
                    scope.$watch(function () {
                        return d3.select(iElement[0])[0][0].offsetHeight;
                    }, function () {
                        return scope.render(scope.data);
                    });

                    scope.$watch(function () {
                        return d3.select(iElement[0])[0][0].offsetWidth;
                    }, function () {
                        return scope.render(scope.data);
                    });


                    // watch for data changes and re-render
                    scope.$watch('data', function (newVals, oldVals) {
                        return scope.render(scope.data);
                    }, true);


                    // define render function
                    scope.render = function (data) {

                        // refresh canvas by removing all previous items at the start of each rendering
                        svg.selectAll("*").remove();

                        // set up overall container variables
                        var height, width;
                        height = d3.select(iElement[0])[0][0].offsetHeight;
                        width = d3.select(iElement[0])[0][0].offsetWidth;

                        // stop rendering and return immediately if DOM is not fully initialised
                        if (height == 0) {
                            return;
                        }

                        // set up chart variables
                        var margin = {top: 20, right: 20, bottom: 30, left: 30},
                            chartWidth = width - margin.left - margin.right,
                            chartHeight = height - margin.top - margin.bottom;

                        // transform data
                        // base height: to keep track of the height of empty rect below each bar
                        // value: the actual height of each bar
                        var transformData = function () {

                            for (var i = 0; i < data.length; i++) {

                                if (i == 0 || i == data.length - 1) {
                                    data[i].baseHeight = 0;
                                    data[i].value = data[i].count;
                                } else {
                                    data[i].value = data[i].count - data[i - 1].count;
                                    if (data[i].value >= 0) {
                                        data[i].baseHeight = data[i].count - data[i].value;
                                    } else {
                                        data[i].baseHeight = data[i].count;
                                    }

                                }
                            }
                        };

                        transformData();


                        // set up svg
                        // append "g", which is used to group its children elements
                        // then transform the "g", which will be applied to all children elements
                        var chart = svg.attr('height', height)
                            .attr('width', width)   // set up svg to be size of container
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                        // set up scales and axes

                        // define x-scale function, to be used to transform all x related data
                        var padding = {inner: .05, outer: 0};

                        var x = d3.scale.ordinal()
                            .rangeBands([0, chartWidth], padding.inner, padding.outer)
                            .domain(data.map(function (d) {
                                return d.month;
                            }));

                        // define y-scale function, to be used to transform all y related data
                        var max = d3.max(data, function (d) {
                            return d.count;
                        });

                        var y = d3.scale.linear()
                            .range([chartHeight, 0])
                            .domain([0, max]);


                        // define axes functions
                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("right")
                            .tickSize(chartWidth);


                        // add axes to chart

                        // yA is just an arbitrary var defined to store the DOM element "g" that is defined within 'chart'
                        var yA = chart.append("g")
                            .attr("class", "y axis")
                            .call(yAxis);


                        yA.selectAll("g")
                            .filter(function (d) {
                                return d;
                            })
                            .classed("minor", true);

                        yA.selectAll("text")// manually change the position of text label, if not it will orient to RHS
                            .attr("x", -20)
                            .attr("dy", 2.5);

                        /* to add axis label within yA group

                         yA.append("text")
                         .attr("transform", "rotate(-90)")
                         .attr("y", 6)
                         .attr("dy", ".71em")
                         .style("text-anchor", "end")
                         .text("");
                         */

                        chart.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(" + 0 + "," + chartHeight + ")")
                            .call(xAxis);


                        // append bars
                        // append "g" and classed it to "bars" to group all bar elements together
                        chart.append("g")
                            .attr("class", "bars")
                            .selectAll(".bar")
                            .data(data)
                            .enter().append("rect")
                            .attr("class", "bar")
                            .attr("x", function (d) {
                                return x(d.month);
                            })
                            .attr("width", x.rangeBand())// use x.rangeBand() to save hassle of manual calculation
                            .attr("y", function (d) {
                                if (d.value >= 0) {
                                    return y(d.value + d.baseHeight);
                                } else {
                                    return y(-(d.value) + d.baseHeight);
                                }
                            }
                        )
                            .attr("height", function (d) {
                                return Math.abs(d.value) / (max / chartHeight);
                            })
                            .attr("class", function (d, i) { // dynamically assign classes to bars
                                if (i == 0 || i == data.length - 1) {
                                    return "normal";
                                } else if (d.value >= 0) {
                                    return "positive";
                                } else {
                                    return "negative";
                                }
                            }
                        );

                        // append labels
                        var labelOffset = 8;  //offset from edge of bar
                        var labelPadding = 5;

                        chart.append("g")
                            .attr("class", "barLabels")
                            .selectAll(".labels")
                            .data(data)
                            .enter().append("text")
                            .attr("x", function (d) {
                                return x(d.month) + (x.rangeBand()) / 2;
                            })
                            .attr("y", function (d) {
                                if (d.value >= 0) {
                                    return y(d.value + d.baseHeight) + labelOffset + labelPadding;
                                } else {
                                    return y(d.baseHeight) - labelPadding;
                                }
                            })
                            .attr("fill", "white")
                            .style("text-anchor", "middle")
                            .text(function (d, i) {
                                var barHeight = Math.abs(d.value) / (max / chartHeight);

                                if (barHeight > 15 && x.rangeBand() > 20) {   // where x.rangeBand() is the bar width

                                    if (i == 0 || i == data.length - 1) {
                                        return d.value;
                                    } else if (d.value >= 0) {
                                        return "+" + d.value;
                                    } else {
                                        return d.value;
                                    }
                                } else {
                                    return "";
                                }


                            });


                    };
                }
            };
        }]);

}());
