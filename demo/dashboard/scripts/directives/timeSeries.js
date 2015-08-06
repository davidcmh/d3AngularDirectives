(function () {
    'use strict';

    angular.module('myApp.directives')
        .directive('d3TimeSeries', [function () {
            return {
                restrict: 'EA',
                scope: {
                    data: "=",
                    label: "@",
                    onClick: "&"
                },
                link: function (scope, iElement, iAttrs) {

                    // necessary to set margins so that axes and labels don't get cut off
                    var margin = {
                        top: 20,
                        right: 50,
                        bottom: 30,
                        left: 50
                    }

                    var svg = d3.select(iElement[0]).append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%")


                    var sourcesMap = {
                        agencies: "Agencies",
                        jobBoard: "Job Board",
                        referrals: "Referrals"
                    };

                    // to check if month is a text, for monthIsText() function
                    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                    // this margin is necessary for the axes to be displayed, otherwise they will be cut off, basically translate it x, y
                    /* this was included in the original code, but doesnt seem useful 
                     // watch for resizing of window, and re-render d3 canvas
                     window.onresize = function () {
                     console.log("resizing of window");
                     return scope.$apply();
                     };

                     scope.$watch(function () {
                     return angular.element(window)[0].innerWidth;
                     }, function () {
                     console.log("window resized");
                     return scope.render(scope.data);
                     });
                     */

                    /*
                     var parsedDate = 0;
                     var parsed = false;
                     */
                    // watch for data changes and re-render
                    scope.$watch('data', function (newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);


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


                    // define render function
                    scope.render = function (data) {
                        // remove all previous items before render
                        svg.selectAll("*").remove();


                        // Get width and height of element
                        var elementWidth = d3.select(iElement[0])[0][0].offsetWidth;
                        var elementHeight = d3.select(iElement[0])[0][0].offsetHeight;

                        if (elementHeight == 0) {
                            return;
                        }


                        var legendWidth = 80;

                        var chartWidth = elementWidth - margin.left - margin.right - legendWidth;
                        var chartHeight = elementHeight - margin.top - margin.bottom;


                        var chart = svg.append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                        var parseDate = d3.time.format("%B").parse;


                        var x = d3.time.scale()
                            .range([0, chartWidth]);

                        var y = d3.scale.linear()
                            .range([chartHeight, 0]);


                        var color = d3.scale.ordinal();
                        color.range(['#5CAFAF', '#FF6262', 'black']);


                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .ticks(d3.time.month)
                            .orient("bottom");


                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .tickSize(chartWidth)
                            .orient("right");

                        var line = d3.svg.line()
                            .interpolate("linear") //basis, linear
                            .x(function (d) {
                                return x(d.month);
                            })
                            .y(function (d) {
                                return y(d.total);
                            });


                        color.domain(d3.keys(data[0]).filter(function (key) {
                            return key !== "month";
                        }));


                        var parseMonth = function () {
                            if (monthIsText(data[0].month)) {
                                data.forEach(function (d) {
                                    d.month = parseDate(d.month);
                                });
                            }
                            ;
                        }

                        var monthIsText = function (month) {
                            var isText = false;
                            months.forEach(function (d) {
                                if (month === d) {
                                    isText = true;
                                }
                            });
                            return isText;
                        }

                        parseMonth();


                        // maps each source of data to a color
                        // 'name' passed as a parameter to the map function, is passed from the domain
                        // domain of color is defined in the line above, which passes all header names into it
                        var sources = color.domain().map(function (name) {
                            return {
                                name: name,
                                values: data.map(function (d) {
                                    return {
                                        month: +d.month,
                                        total: +d[name] // '+' here works like Number( ), to typeset the data into number
                                    };
                                })
                            };
                        });


                        x.domain(d3.extent(data, function (d) {
                            return d.month;
                        }));


                        y.domain([
                            0,
                            d3.max(sources, function (s) {
                                return d3.max(s.values, function (x) {
                                    return x.total;
                                });
                            })
                        ]);


                        chart.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + chartHeight + ")")
                            .call(xAxis);

                        var yA = chart.append("g")
                            .attr("class", "y axis")
                            .call(yAxis);

                        yA.selectAll("g").filter(function (d) {
                            return d;
                        })
                            .classed("minor", true);

                        yA.selectAll("text")
                            .attr("x", -20)
                            .attr("dy", 2.5);


                        var source = chart.selectAll(".source")
                            .data(sources)
                            .enter().append("g")
                            .attr("class", "source");

                        source.append("path")
                            .attr("class", "line")
                            .attr("d", function (d) {
                                return line(d.values); // line is a function defined above to handle these values
                            })
                            .style("stroke", function (d) {
                                return color(d.name);
                            });


                        source.selectAll(".miniCircle1")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) {
                                return x(d.month);
                            })
                            .attr("cy", function (d) {
                                return y(d["agencies"]);
                            })
                            .attr("fill", function (d) {
                                return color("agencies");
                            })
                            .attr("r", 3)


                        source.selectAll(".miniCircle2")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) {
                                return x(d.month);
                            })
                            .attr("cy", function (d) {
                                return y(d["jobBoard"]);
                            })
                            .attr("fill", function (d) {
                                return color("jobBoard");
                            })
                            .attr("r", 3)

                        source.selectAll(".miniCircle3")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) {
                                return x(d.month);
                            })
                            .attr("cy", function (d) {
                                return y(d["referrals"]);
                            })
                            .attr("fill", function (d) {
                                return color("referrals");
                            })
                            .attr("r", 3)

                        var offsetForLegendRect = (elementHeight - (sources.length * 35)) / 2;

                        var legend = svg.selectAll(".legend")
                            .data(sources)
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", function (d, i) {
                                return "translate(0," + ((i * 35) + offsetForLegendRect) + ")";
                            });

                        legend.append("rect")
                            .attr("x", margin.left + chartWidth + 20)
                            .attr("width", 35)
                            .attr("height", 30)
                            .style("fill", function (d) {
                                return color(d.name)
                            });

                        // display name for each source in legend
                        legend.append("text")
                            .attr("x", margin.left + chartWidth + 60)
                            .attr("y", 9)
                            .attr("dy", ".8em")
                            .style("text-anchor", "start")
                            .text(function (d) {
                                return sourcesMap[d.name];
                            });


                        var sourceTotal = function (s) {
                            var total = 0;
                            for (var i = 0; i < s.values.length; i++) {
                                total += s.values[i].total;
                            }
                            ;
                            return total;
                        };

                        var sourcesSum = (function () {
                            var sum = 0;

                            for (var i = 0; i < sources.length; i++) {
                                sum += sourceTotal(sources[i]);
                            }

                            return sum;


                        })();

                        // to display percentage for each source

                        legend.append("text")
                            .attr("x", margin.left + chartWidth + 23)
                            .attr("y", 9)
                            .attr("dy", ".8em")
                            .attr("fill", "white")
                            .style("text-anchor", "start")
                            .text(function (d, i) {
                                return (((sourceTotal(sources[i])) / sourcesSum) * 100).toFixed(1) + "%";
                            });

                        // to display header 'Total' for legend
                        svg.append("text")
                            .attr("x", margin.left + chartWidth + 22)
                            .attr("y", offsetForLegendRect - 15)
                            .attr("font-size", 11)
                            .text("Total");


                        /* style

                         .overlay {
                         fill: none;
                         pointer-events: all;
                         }

                         .focus circle {
                         fill: none;
                         stroke: steelblue;
                         }

                         */


                        var bisectMonth = d3.bisector(function (d) {
                            return d.month;
                        }).left;

                        var focusLine = svg.append("line")
                            .style("display", "none");

                        var focus1 = svg.append("g")
                            .attr("class", "focus")
                            .style("display", "none");

                        focus1.append("circle")
                            .attr("r", 3);

                        focus1.append("rect")
                            .attr("rx", 2)
                            .attr("ry", 2)
                            .attr("x", 7)
                            .attr("y", -6)
                            .attr("height", 12)
                            .attr("width", 21)
                            .attr("fill", "white")
                            .style("opacity", "0.8")
                            .style("stroke", "black")
                            .style("stroke-width", "1")
                        ;


                        focus1.append("text")
                            .attr("x", 12)
                            .attr("dy", ".35em");


                        var focus2 = svg.append("g")
                            .attr("class", "focus")
                            .style("display", "none");

                        focus2.append("circle")
                            .attr("r", 3);

                        focus2.append("rect")
                            .attr("rx", 2)
                            .attr("ry", 2)
                            .attr("x", 7)
                            .attr("y", -6)
                            .attr("height", 12)
                            .attr("width", 21)
                            .attr("fill", "white")
                            .style("opacity", "0.8")
                            .style("stroke", "black")
                            .style("stroke-width", "1")
                        ;


                        focus2.append("text")
                            .attr("x", 12)
                            .attr("dy", ".35em");


                        var focus3 = svg.append("g")
                            .attr("class", "focus")
                            .style("display", "none");

                        focus3.append("circle")
                            .attr("r", 3);

                        focus3.append("rect")
                            .attr("rx", 2)
                            .attr("ry", 2)
                            .attr("x", 7)
                            .attr("y", -6)
                            .attr("height", 12)
                            .attr("width", 21)
                            .attr("fill", "white")
                            .style("opacity", "0.8")
                            .style("stroke", "black")
                            .style("stroke-width", "1")
                        ;


                        focus3.append("text")
                            .attr("x", 12)
                            .attr("dy", ".35em");


                        chart.append("rect")
                            .attr("class", "overlay")
                            .attr("width", chartWidth)
                            .attr("height", chartHeight)
                            .on("mouseover", function () {
                                focus1.style("display", null);
                                focus2.style("display", null);
                                focus3.style("display", null);
                                focusLine.style("display", null);
                            })
                            .on("mouseout", function () {
                                focus1.style("display", "none");
                                focus2.style("display", "none");
                                focus3.style("display", "none");
                                focusLine.style("display", "none");
                            })
                            .on("mousemove", mousemove);

                        function mousemove() {
                            var x0 = x.invert(d3.mouse(this)[0]),   // invert range to get the domain for x, which will return the date
                                i = bisectMonth(data, x0, 1),
                                d0 = data[i - 1],
                                d1 = data[i],
                                d = x0 - d0.month > d1.month - x0 ? d1 : d0; // highlight the node that is closer to the mouse

                            focus1.attr("transform", "translate(" + (margin.left + x(d.month)) + "," + (margin.top + y(d.agencies)) + ")");


                            focus1.select("text").text(d.agencies);

                            focus2.attr("transform", "translate(" + (margin.left + x(d.month)) + "," + (margin.top + y(d.jobBoard)) + ")");
                            focus2.select("text").text(d.jobBoard);

                            focus3.attr("transform", "translate(" + (margin.left + x(d.month)) + "," + (margin.top + y(d.referrals)) + ")");
                            focus3.select("text").text(d.referrals);


                            focusLine.attr("x1", margin.left + x(d.month))
                                .attr("y1", margin.top)
                                .attr("x2", margin.left + x(d.month))
                                .attr("y2", margin.top + chartHeight)
                                .attr("stroke-width", 1)
                                .style("stroke", "#4C4C4C");
                        }


                    };


                }

            };
        }]);

}());
