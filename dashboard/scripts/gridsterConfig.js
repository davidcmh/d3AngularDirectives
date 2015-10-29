(function () {

    'use strict';


    angular.module('myApp.simpleGrid')

        .directive('integer', function () {
            return {
                require: 'ngModel',
                link: function (scope, ele, attr, ctrl) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        if (viewValue === '' || viewValue === null || typeof viewValue === 'undefined') {
                            return null;
                        }
                        return parseInt(viewValue, 10);
                    });
                }
            };
        })

        .controller('MainCtrl', function ($scope) {

            $scope.gridsterOpts = {
                columns: 12,
                margins: [10, 10],
                outerMargin: true,
                pushing: true,
                floating: true,
                draggable: {
                    enabled: true
                },
                resizable: {
                    enabled: true,
                    handles: ['n', 'e', 's', 'w', 'se', 'sw']
                }
            };

            // first column
            $scope.checkboxBox = {
                sizeX: 2,
                sizeY: 9,
                row: 0,
                col: 0
            };

            // second column
            $scope.funnelBox = {
                sizeX: 7,
                sizeY: 3,
                row: 0,
                col: 2
            };

            $scope.timeSeriesBox = {
                sizeX: 7,
                sizeY: 3,
                row: 3,
                col: 2
            };

            $scope.waterfallBox = {
                sizeX: 7,
                sizeY: 3,
                row: 6,
                col: 2
            };

            // third column
            $scope.stackBarBox = {
                sizeX: 3,
                sizeY: 3,
                row: 0,
                col: 9
            };

            $scope.donutBox = {
                sizeX: 3,
                sizeY: 3,
                row: 3,
                col: 9
            };

            $scope.horizontalBarBox = {
                sizeX: 3,
                sizeY: 3,
                row: 6,
                col: 9
            };


        });

}());
