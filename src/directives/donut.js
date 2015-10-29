(function () {
    'use strict';

    angular.module('myApp.directives')
        .directive('d3Donut', [function () {
            return {
                restrict: 'EA',
                scope: {
                    data: "=",
                    label: "@",
                    onClick: "&"
                },
                link: function (scope, iElement, iAttrs) {
                    var svg = d3.select(iElement[0])
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%");


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

                        // transform data into array form
                        var dataArr = [
                            {
                                cat: "low",
                                count: data.low
                            },
                            {
                                cat: "average",
                                count: data.average
                            },
                            {
                                cat: "high",
                                count: data.high
                            }
                        ]

                        // set up overall container variables
                        var height, width;
                        height = d3.select(iElement[0])[0][0].offsetHeight;
                        width = d3.select(iElement[0])[0][0].offsetWidth;

                        // stop rendering and return immediately if DOM is not fully initialised
                        if (height == 0) {
                            return;
                        }

                        // set up chart variables
                        var paddingArc, countTotal;

                        paddingArc = 0.03;   // padding between arcs
                        countTotal = d3.sum(dataArr, function (d) {
                            return d.count;
                        });


                        // set up color range & domain
                        var color = d3.scale.ordinal();
                        color.range(['#5CAFAF', '#FF6262', 'black']);

                        // collate array of categories for domain
                        var catArray = d3.keys(data).filter(function (key) {
                            return key !== "trend";
                        });

                        color.domain(catArray);


                        // get radius based on minimum between width and height
                        var radius = (Math.min(width, height) / 2);

                        // radius is measured from centre of chart,
                        // so "-10" will make it 10px away from wall of container
                        var arc = d3.svg.arc()
                            .outerRadius(radius - 10)
                            .innerRadius(radius - 50);

                        // pie function to calculate arc angles
                        var pie = d3.layout.pie()
                            .sort(null)
                            .padAngle(paddingArc)
                            .value(function (d) {
                                return d.count;
                            });


                        // set up svg
                        svg.attr('height', height)
                            .attr('width', width);


                        // create donut chart (first translate centre of chart)
                        var donut = svg.append("g")
                            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                            .selectAll(".arc")
                            .data(pie(dataArr))
                            .enter()
                            .append("g")
                            .attr("class", "arc");

                        donut.append("path")
                            .attr("d", arc)
                            .attr("fill", function (d) {
                                return color(d.data.cat); // object passed in here is in predefined format of arc
                            });


                        // create labels: percentage for each category
                        donut.append("text")
                            .attr("transform", function (d) {
                                return "translate(" + arc.centroid(d) + ")";
                            })
                            .attr("dy", ".35em")
                            .attr("fill", 'white')
                            .style("text-anchor", "middle")
                            .text(function (d) {
                                return ((d.data.count / countTotal) * 100).toFixed(1) + "%";
                            });


                    };
                }
            };
        }]);

}());
