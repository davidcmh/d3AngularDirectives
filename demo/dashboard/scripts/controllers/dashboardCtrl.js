(function () {
    'use strict';

    angular.module('myApp.controllers')
        .controller('DashboardCtrl', ['$scope', function ($scope) {
            $scope.title = "DashboardCtrl";
            // data for roles
            $scope.roleDataset = [
                {
                    role: "Sales Associate",
                    vacancies: 50,
                    hires: 30,
                    candidates_per_hire: 950 / 30,
                    stages: [
                        {stage: "Application", total: 950, outstanding: 800},
                        {stage: "CV Screening", total: 600, outstanding: 400},
                        {stage: "Stage 1", total: 300, outstanding: 200},
                        {stage: "Stage 2", total: 150, outstanding: 120},
                        {stage: "Offers made", total: 70, outstanding: 50},
                        {stage: "Offers accepted", total: 30, outstanding: 10}
                    ],
                    time_to_offer: {
                        low: 10,
                        average: 18,
                        high: 25,
                        trend: +3
                    },
                    cost_of_hire: {
                        low: 6500,
                        average: 9000,
                        high: 12000,
                        trend: 0
                    },
                    sources: [
                        {month: "April", agencies: 21, jobBoard: 53, referrals: 20},
                        {month: "May", agencies: 42, jobBoard: 40, referrals: 25},
                        {month: "June", agencies: 30, jobBoard: 65, referrals: 45},
                        {month: "July", agencies: 48, jobBoard: 90, referrals: 50}
                    ],
                    checkbox: true
                },
                {
                    role: "Software Developer",
                    vacancies: 100,
                    hires: 50,
                    candidates_per_hire: 1000 / 50,
                    stages: [
                        {stage: "Application", total: 1000, outstanding: 800},
                        {stage: "CV Screening", total: 750, outstanding: 500},
                        {stage: "Stage 1", total: 350, outstanding: 180},
                        {stage: "Stage 2", total: 160, outstanding: 120},
                        {stage: "Offers made", total: 90, outstanding: 50},
                        {stage: "Offers accepted", total: 50, outstanding: 20}
                    ],
                    time_to_offer: {
                        low: 12,
                        average: 17,
                        high: 21,
                        trend: +2
                    },
                    cost_of_hire: {
                        low: 4000,
                        average: 10000,
                        high: 15000,
                        trend: -2
                    },
                    sources: [
                        {month: "April", agencies: 43, jobBoard: 31, referrals: 15},
                        {month: "May", agencies: 37, jobBoard: 35, referrals: 20},
                        {month: "June", agencies: 56, jobBoard: 28, referrals: 43},
                        {month: "July", agencies: 65, jobBoard: 21, referrals: 48}
                    ],
                    checkbox: false
                },
                {
                    role: "Call Centre Rep",
                    vacancies: 200,
                    hires: 125,
                    candidates_per_hire: 1200 / 125,
                    stages: [
                        {stage: "Application", total: 1200, outstanding: 600},
                        {stage: "CV Screening", total: 850, outstanding: 450},
                        {stage: "Stage 1", total: 450, outstanding: 250},
                        {stage: "Stage 2", total: 260, outstanding: 170},
                        {stage: "Offers made", total: 130, outstanding: 70},
                        {stage: "Offers accepted", total: 65, outstanding: 30}
                    ],
                    time_to_offer: {
                        low: 10,
                        average: 14,
                        high: 18,
                        trend: +1
                    },
                    cost_of_hire: {
                        low: 2500,
                        average: 4000,
                        high: 7000,
                        trend: -1
                    },
                    sources: [
                        {month: "April", agencies: 52, jobBoard: 27, referrals: 25},
                        {month: "May", agencies: 40, jobBoard: 25, referrals: 15},
                        {month: "June", agencies: 36, jobBoard: 37, referrals: 33},
                        {month: "July", agencies: 56, jobBoard: 15, referrals: 39}
                    ],
                    checkbox: false
                },
                {
                    role: "System Admin",
                    vacancies: 30,
                    hires: 23,
                    candidates_per_hire: 500 / 23,
                    stages: [
                        {stage: "Application", total: 500, outstanding: 350},
                        {stage: "CV Screening", total: 200, outstanding: 90},
                        {stage: "Stage 1", total: 100, outstanding: 60},
                        {stage: "Stage 2", total: 70, outstanding: 30},
                        {stage: "Offers made", total: 40, outstanding: 15},
                        {stage: "Offers accepted", total: 20, outstanding: 9}
                    ],
                    time_to_offer: {
                        low: 14,
                        average: 18,
                        high: 24,
                        trend: -2
                    },
                    cost_of_hire: {
                        low: 4500,
                        average: 6500,
                        high: 9000,
                        trend: 0
                    },
                    sources: [
                        {month: "April", agencies: 25, jobBoard: 22, referrals: 19},
                        {month: "May", agencies: 18, jobBoard: 19, referrals: 14},
                        {month: "June", agencies: 35, jobBoard: 36, referrals: 32},
                        {month: "July", agencies: 55, jobBoard: 25, referrals: 25}
                    ],
                    checkbox: false
                },
                {
                    role: "Legal",
                    vacancies: 55,
                    hires: 30,
                    candidates_per_hire: 650 / 30,
                    stages: [
                        {stage: "Application", total: 650, outstanding: 400},
                        {stage: "CV Screening", total: 350, outstanding: 200},
                        {stage: "Stage 1", total: 200, outstanding: 160},
                        {stage: "Stage 2", total: 140, outstanding: 110},
                        {stage: "Offers made", total: 70, outstanding: 45},
                        {stage: "Offers accepted", total: 35, outstanding: 15}
                    ],
                    time_to_offer: {
                        low: 18,
                        average: 22,
                        high: 30,
                        trend: +3
                    },
                    cost_of_hire: {
                        low: 9000,
                        average: 11000,
                        high: 16000,
                        trend: -2
                    },
                    sources: [
                        {month: "April", agencies: 33, jobBoard: 23, referrals: 25},
                        {month: "May", agencies: 28, jobBoard: 19, referrals: 22},
                        {month: "June", agencies: 48, jobBoard: 25, referrals: 33},
                        {month: "July", agencies: 62, jobBoard: 31, referrals: 38}
                    ],
                    checkbox: false
                }
            ];


            $scope.waterfallData = [
                {month: "Start", count: 45},
                {month: "January", count: 33},
                {month: "February", count: 50},
                {month: "March", count: 45},
                {month: "April", count: 62},
                {month: "May", count: 126},
                {month: "June", count: 49},
                {month: "July", count: 31},
                {month: "August", count: 25},
                {month: "September", count: 83},
                {month: "October", count: 63},
                {month: "November", count: 46},
                {month: "December", count: 58},
                {month: "End", count: 58}
            ];


            $scope.d3OnClick = function (item) {
                alert(item.name);
            };

            $scope.role = $scope.roleDataset[0].role;
            $scope.funnelData = $scope.roleDataset[0].stages;
            $scope.timeSeriesData = $scope.roleDataset[0].sources;
            $scope.costData = $scope.roleDataset[0].cost_of_hire;
            $scope.timeData = $scope.roleDataset[0].time_to_offer;

            $scope.stackData = $scope.timeData;


            $scope.change = function () {


                var arr = [];

                angular.forEach($scope.roleDataset, function (item) {
                    if (item.checkbox)
                        arr.push(item);
                });


                // check back here, to include case where none is selected
                if (arr.length == 1) {
                    $scope.role = arr[0].role;
                    $scope.funnelData = arr[0].stages;
                    $scope.timeSeriesData = arr[0].sources;
                    $scope.costData = arr[0].cost_of_hire;
                    $scope.timeData = arr[0].time_to_offer;

                    $scope.stackData = $scope.timeData;
                } else if (arr.length > 1) {

                    $scope.role = arr[0].role;
                    $scope.funnelData = [];
                    $scope.timeSeriesData = [];

                    // update role
                    for (var j = 1; j < arr.length; j++) {
                        $scope.role += " & " + arr[j].role;
                    }

                    // update funnel data
                    for (var i = 0; i < arr[0].stages.length; i++) {
                        var totalOutstanding = 0;
                        var totalTotal = 0;

                        for (var j = 0; j < arr.length; j++) {
                            totalOutstanding += arr[j].stages[i].outstanding;
                            totalTotal += arr[j].stages[i].total;
                        }
                        $scope.funnelData.push({
                            stage: arr[0].stages[i].stage,
                            total: totalTotal,
                            outstanding: totalOutstanding
                        });

                    }

                    // update time series data
                    for (var i = 0; i < arr[0].sources.length; i++) {
                        var totalAgencies = 0;
                        var totalJobBoard = 0;
                        var totalReferrals = 0;

                        for (var j = 0; j < arr.length; j++) {
                            totalAgencies += arr[j].sources[i].agencies;
                            totalJobBoard += arr[j].sources[i].jobBoard;
                            totalReferrals += arr[j].sources[i].referrals;
                        }
                        $scope.timeSeriesData.push({
                            month: arr[0].sources[i].month,
                            agencies: totalAgencies,
                            jobBoard: totalJobBoard,
                            referrals: totalReferrals
                        });
                    }

                    // update cost data
                    var totalLow = 0;
                    var totalAve = 0;
                    var totalHigh = 0;
                    var totalTrend = 0;

                    for (var i = 0; i < arr.length; i++) {
                        totalLow += arr[i].cost_of_hire.low;
                        totalAve += arr[i].cost_of_hire.average;
                        totalHigh += arr[i].cost_of_hire.high;
                        totalTrend += arr[i].cost_of_hire.trend;
                    }

                    $scope.costData = {
                        low: (totalLow / arr.length).toFixed(0),
                        average: (totalAve / arr.length).toFixed(0),
                        high: (totalHigh / arr.length).toFixed(0),
                        trend: (totalTrend / arr.length).toFixed(0)
                    }

                    // update time data
                    totalLow = 0;
                    totalAve = 0;
                    totalHigh = 0;
                    totalTrend = 0;

                    for (var i = 0; i < arr.length; i++) {
                        totalLow += arr[i].time_to_offer.low;
                        totalAve += arr[i].time_to_offer.average;
                        totalHigh += arr[i].time_to_offer.high;
                        totalTrend += arr[i].time_to_offer.trend;
                    }

                    $scope.timeData = {
                        low: (totalLow / arr.length).toFixed(0),
                        average: (totalAve / arr.length).toFixed(0),
                        high: (totalHigh / arr.length).toFixed(0),
                        trend: (totalTrend / arr.length).toFixed(0)
                    }

                    $scope.stackData = $scope.timeData;

                }
            }

        }]);

}());
