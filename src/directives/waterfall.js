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


                    // Watch for changes in parent element size
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

                        // remove all previous items before render
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
                        // base height to keep track of the height of empty rect below each bar
                        // value is the actual height of each bar
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
                        var chart = svg.attr('height', height)
                            .attr('width', width)   // set up svg to be size of container
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                        // transform/translate the 'g' child element by the margin


                        // set up scales
                        var max = d3.max(data, function (d) {
                            return d.count;
                        });

                        var padding = {inner: .05, outer: 0};

                        var x = d3.scale.ordinal()
                            .rangeBands([0, chartWidth], padding.inner, padding.outer);

                        x.domain(data.map(function (d) {
                            return d.month;
                        }));


                        var y = d3.scale.linear()
                            .range([chartHeight, 0]);

                        y.domain([0, max]);           // the order of this matters, if it's after the yAxis block below, this domain won't be picked up, and range will become just a percentage


                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");

                        var yAxis = d3.svg.axis()
                                .scale(y)
                                .orient("right")
                                .tickSize(chartWidth)

                            ;

                        // yA is just an arbitrary var defined to store the DOM element "g" that is defined within 'chart'
                        var yA = chart.append("g")
                            .attr("class", "y axis")
                            .call(yAxis);


                        yA.selectAll("g").filter(function (d) {
                            return d;
                        })
                            .classed("minor", true);

                        yA.selectAll("text")// manually change the position of text label, if not it will orient to RHS too
                            .attr("x", -20)
                            .attr("dy", 2.5);


                        /* to add axis label within yA group

                         yA.append("text")    // for label
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



                        chart.append("g")// added the extra append("g") before adding to bars, to group all the bars within this parent element
                            .attr("class", "bars")// added "class" just to make the code clearer, by assigning a name to this group of child elements
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
                            .attr("class", function (d, i) {              // set classes to bars, depending on their values
                                if (i == 0 || i == data.length - 1) {
                                    return "normal";
                                } else if (d.value >= 0) {
                                    return "positive";
                                } else {
                                    return "negative";
                                }
                            }
                        );

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
