(function () {
'use strict';

angular.module('myApp.directives')
.directive('d3StackBar', [function () {
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

                // transform data
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
                
                // set up bar chart variables
                var paddingTop, paddingLeft, barHeight, barWidth,  countTotal, paddingStack;
                
                paddingTop = 15;
                paddingLeft = 10;
                barHeight = (height - (paddingTop*2));
                barWidth = (width - (paddingLeft*2));
                countTotal = d3.sum(dataArr, function(d) {
                                    return d.count;
                });
                paddingStack = 2;
                
   
                
                // set up color range & domain
                 var color = d3.scale.ordinal();
                        color.range(['#5CAFAF', '#FF6262', 'black']);
                
                // collate array of categories for domain
                var catArray = d3.keys(data).filter(function (key) {
                            return key !== "trend";
                        });
                    
                color.domain(catArray);

                
                
                // set up svg
                svg.attr('height', height)
                    .attr('width', width);

                // to track the current height of stack bar
                var heightCurrent = paddingTop;

                // create bar chart
                svg.selectAll("rect")
                    .data(dataArr)
                    .enter()
                    .append("rect")
                    .attr("x", paddingLeft)
                    .attr("y", function(d, i) {
                        var y = heightCurrent;
                        heightCurrent += (barHeight * (d.count/countTotal));
                        return y;
                    })
                    .attr("width", barWidth)
                    .attr("height", function (d) {
                        return (barHeight * (d.count/countTotal)) - paddingStack;
                    })
                    .attr("fill", function(d) { 
                        return color(d.cat);
                    })
                ;

                
                
                // create labels: percentage for each category
                
                heightCurrent = paddingTop;
                var textPadding = 2;   // to align it to center of stack height
                
                svg.selectAll("text")
                    .data(dataArr)
                    .enter()
                    .append("text")
                    .attr("fill", "white")
                    .attr("x", paddingLeft + barWidth/2)
                    .attr("y", function(d) {
                        var stackHeight = (barHeight * (d.count/countTotal)) - paddingStack;
                        var y = heightCurrent + (stackHeight/2) + textPadding;
                        heightCurrent += stackHeight + paddingStack;
                        return y;
                    })     
                    .text(function (d) {
                        var stackHeight = (barHeight * (d.count/countTotal)) - paddingStack;
                        if (stackHeight > 10 && barWidth > 20)
                            return ((d.count/countTotal)*100).toFixed(1) + "%";
                        else 
                            return;
                    })
                    .style("text-anchor", "middle")
                ;


            };
        }
    };
}]);

}());
