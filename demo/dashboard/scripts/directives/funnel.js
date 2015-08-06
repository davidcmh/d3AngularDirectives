(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('d3Funnel', [function() {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          label: "@",
          onClick: "&"
        },
        link: function(scope, iElement, iAttrs) {
          
            var svg = d3.select(iElement[0])
              .append("svg")
              .attr("width", "100%");

     
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
          scope.$watch('data', function(newVals, oldVals) {
            return scope.render(newVals);
          }, true);
            
          // define render function
          scope.render = function(data){
             // remove all previous items before render
            svg.selectAll("*").remove();

            // setup variables
              // width height for overall svg, and max is the maximum value
            var width, height, max, barHeight;
              
     

            width = d3.select(iElement[0])[0][0].offsetWidth;
            height = d3.select(iElement[0])[0][0].offsetHeight;
              
               if (height == 0) {
                  return;
            }    
              max = data[0].total + 50;
              
              
              // Width and height of SVG element
            var marginSide = 20;
            var col1_w = 100;
            var col2_w = 50;
            var col3_w;
            var col4_w = 35;
            var col5_w = 60;
             
              col3_w = width - col1_w - col2_w - col4_w - col5_w - (marginSide * 2);
              
              
            var barPadding = 2;
            var textOffset_y = (height/(data.length + 2))/2;


            // Create SVG element
            svg.attr("width", width) 
                .attr("height", height);


            // Create funnel chart (series of rectangles) using data

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function(d) {
                    return (col3_w - d.total/(max/col3_w))/2 + (col1_w + col2_w + marginSide);    // offset on the left for text. 
                })
                .attr("y", function(d, i) {
                    return (i + 1.5) * (height/(data.length + 2));
                })
                .attr("width", function(d) {
                    return d.total/(max/col3_w);    // to do: make width adaptable to biggest data point size
                })
                .attr("height", (height/(data.length + 2)) - barPadding)   
                .attr("fill", "#5CAFAF");




            // header TODO: factorise code
            svg.append("text")
                .text("Outstanding")
                .attr("text-anchor", "middle")
                .attr("x", marginSide + col1_w + col2_w/2)
                .attr("y", 0.5 * (height/(data.length + 2)) + textOffset_y)
                .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");

            svg.append("text")
                .text("Total")
                .attr("text-anchor", "middle")
                .attr("x", marginSide + col1_w + col2_w + col3_w + col4_w/2)
                .attr("y", 0.5 * (height/(data.length + 2)) + textOffset_y)
                .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");

            svg.append("text")
                .text("% Pass")
                .attr("text-anchor", "middle")
                .attr("x", marginSide + col1_w + col2_w + col3_w + col4_w + col5_w/2)
                .attr("y", 0.5 * (height/(data.length + 2)) + textOffset_y)
                .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");

            // col1 for stages
            svg.selectAll("text.col1")   // specify "text.title". if just "text" for both block of text, only the first block's result will be shown.
               .data(data)
               .enter()
               .append("text")
               .text(function(d) {
                    return d.stage;
               })       // here we are simply setting data value as its label
               .attr("text-anchor", "start")    //align text with x value as its end
               .attr("x", marginSide + 2)       
               .attr("y", function(d, i) {
                   return (i + 1.5) * (height/(data.length + 2)) + textOffset_y;    // to do: makes this adaptable
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");


            // col2 for outstanding
            svg.selectAll("text.col2")   
               .data(data)
               .enter()
               .append("text")
               .text(function(d) {
                    return d.outstanding;
               })       // here we are simply setting data value as its label
               .attr("text-anchor", "middle")    //align text with x value as its end
               .attr("x", marginSide + col1_w + col2_w/2)       
               .attr("y", function(d, i) {
                   return (i + 1.5) * (height/(data.length + 2)) + textOffset_y;    // to do: makes this adaptable
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");

            // col4 for total
            svg.selectAll("text.col4")
               .data(data)
               .enter()
               .append("text")
               .text(function(d) {
                    return d.total;
               })       // here we are simply setting data value as its label
               .attr("text-anchor", "middle")    //align text with x value as its end
               .attr("x", marginSide + col1_w + col2_w + col3_w + col4_w/2)       
               .attr("y", function(d, i) {
                   return (i + 1.5) * (height/(data.length + 2)) + textOffset_y;    // to do: makes this adaptable
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");

            // woohoo this works :D
            var prev = 0;

            // col5 for % pass
            svg.selectAll("text.col5")
               .data(data)
               .enter()
               .append("text")
               .text(function(d) {
                    if (prev == 0) {
                        prev = d.total;
                        return "-";    // if previous total is 0, return empty strings
                    } else {
                        var percentagePass = ((d.total/prev) * 100).toFixed(1) + "%";
                        prev = d.total;
                        return percentagePass;
                    }
               })    
               .attr("text-anchor", "middle")    //align text with x value as its end
               .attr("x", marginSide + col1_w + col2_w + col3_w + col4_w + col5_w/2)       
               .attr("y", function(d, i) {
                   return (i + 1.5) * (height/(data.length + 2)) + textOffset_y;    // to do: makes this adaptable
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "black");

            // dotted lines for the table
            svg.selectAll("line1.dashed")
                .data(data)
                .enter()
                .append("line")
                .style("stroke-dasharray", ("2, 2"))
                .attr("x1", marginSide)
                .attr("y1", function(d, i) {
                    return (i + 1.5) * (height/(data.length + 2)) - 1;
                })
                .attr("x2", width - marginSide)
                .attr("y2", function(d, i) {
                    return (i + 1.5) * (height/(data.length + 2)) - 1;
                })
                .attr("stroke-width", 0.4)
                .attr("stroke", "#B2B2B2");
 

          };
        }
      };
    }]);

}());

