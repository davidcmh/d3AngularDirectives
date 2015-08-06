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
                //width: 'auto',
                columns: 12,
                margins: [10, 10],
                outerMargin: false,
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

            // these map directly to gridsterItem options
            $scope.checkboxBox = {
                sizeX: 2,
                sizeY: 11,
                row: 0,
                col: 0
            };

            $scope.waterfallBox = {
                sizeX: 10,
                sizeY: 3,
                row: 0,
                col: 2
            };

            $scope.funnelBox = {
                sizeX: 8,
                sizeY: 3,
                row: 3,
                col: 2
            };

            $scope.timeSeriesBox = {
                sizeX: 8,
                sizeY: 3,
                row: 6,
                col: 2
            };


            $scope.costBox = {
                sizeX: 4,
                sizeY: 2,
                row: 9,
                col: 2
            };

            $scope.timeToOfferBox = {
                sizeX: 4,
                sizeY: 2,
                row: 9,
                col: 6
            };

            $scope.diversityBox = {
                sizeX: 2,
                sizeY: 3,
                row: 3,
                col: 10
            };

            $scope.teamBox = {
                sizeX: 2,
                sizeY: 2,
                row: 6,
                col: 10
            };

            $scope.extraBox = {
                sizeX: 2,
                sizeY: 3,
                row: 8,
                col: 10
            };


        });

}());
