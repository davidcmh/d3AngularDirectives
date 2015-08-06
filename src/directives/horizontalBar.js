(function () {
    'use strict';

    angular.module('myApp.directives')
        .directive('d3HorizontalBar', [function () {
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
                        // remove all previous items before render
                        svg.selectAll("*").remove();

                        var dataArr = [
                            {cat: "low", total: data.low},
                            {cat: "average", total: data.average},
                            {cat: "high", total: data.high}
                        ]


                        // setup variables
                        var width, height, max, barHeight, paddingTop;
                        width = d3.select(iElement[0])[0][0].offsetWidth - 15;
                        height = d3.select(iElement[0])[0][0].offsetHeight;

                        if (height == 0) {
                            return;
                        }

                        max = data.high;
                        barHeight = (height - 35) / 3;
                        paddingTop = 20;


                        svg.attr('height', height)
                            .attr('width', width);

                        // create bar chart
                        svg.selectAll("rect")
                            .data(dataArr)
                            .enter()
                            .append("rect")
                            .attr("x", 40)
                            .attr("y", function (d, i) {
                                return (i * barHeight) + paddingTop;
                            })
                            .attr("width", function (d) {
                                return d.total / (max / width);
                            })
                            .attr("height", barHeight - 7)
                            .attr("fill", "#5CAFAF");


                        // create labels: number for each category
                        svg.selectAll("text1")
                            .data(dataArr)
                            .enter()
                            .append("text")
                            .attr("fill", "white")
                            .attr("y", function (d, i) {
                                return (i * barHeight) + barHeight/2 + paddingTop;
                            })
                            .attr("x", 45)
                            .text(function (d) {
                                return d.total;
                            });

                        // create labels: label for each category (low, average, high)
                        svg.selectAll("text2")
                            .data(dataArr)
                            .enter()
                            .append("text")
                            .attr("fill", "black")
                            .attr("y", function (d, i) {
                                return (i * barHeight) + barHeight/2 + paddingTop;
                            })
                            .attr("x", 0)
                            .text(function (d) {
                                return d.cat;
                            });


                    };
                }
            };
        }]);

}());
