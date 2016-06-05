/* global angular */
(function () {
    "use strict";

    angular.module("components.lockPattern", [])
        .directive("lockPattern", lockPattern);

    lockPattern.$inject = [];
    function lockPattern() {
        var directive = {
            restrict: "E",
            scope: {

            },
            controllerAs: "data",
            bindToController: true,
            //TODO: solve issues with caching of templates for reusable comps
            templateUrl: "lockPattern/lockPattern.html",
            controller: LockPatternController
        };
        return directive;
    }//directive
    /// Directive Controller ///////////////////////////////////
    LockPatternController.$inject = ["$scope", "$interval"];
    function LockPatternController($scope, $interval) {

        // $scope.model = [
        //     {
        //         'fromRow': 0, 'fromCol': 0,
        //         'toRow': 0, 'toCol': 1
        //     },
        //     {
        //         'fromRow': 0, 'fromCol': 1,
        //         'toRow': 1, 'toCol': 1
        //     },
        //     {
        //         'fromRow': 1, 'fromCol': 1,
        //         'toRow': 2, 'toCol': 2
        //     }

        // ];

        $scope.dots = [];
        $scope.patterns = [];

        $scope.getDotX = function (dot) {
            return 100 + dot.col * 400;
        };

        $scope.getDotY = function (dot) {
            return 100 + dot.row * 400;
        };

        $scope.getLineX = function (row, col) {
            var id = "#\\3" + row + " " + col;
            var relevantPointElement = angular.element(document.querySelector(id));
            var x = relevantPointElement.prop('cx');
            if (angular.isUndefined(x)) {
                return 0;
            }
            return x.baseVal.value;
        };

        $scope.getLineY = function (row, col) {
            var id = "#\\3" + row + " " + col;
            var relevantPointElement = angular.element(document.querySelector(id));
            var y = relevantPointElement.prop('cy');
            if (angular.isUndefined(y)) {
                return 0;
            }
            return y.baseVal.value;
        };


        initData();

        var drawPatternIntervalPromise = $interval(changePattern, 50);      
        

        $scope.currentPatternIdx = 0;
        function changePattern() {
            var currentPatternModel = [];
            if ($scope.patterns.length - 1  < $scope.currentPatternIdx) { 
                $interval.cancel(drawPatternIntervalPromise);
                console.log("Finished drawing patterns"); 
                return;
            }
            var currentPattern = $scope.patterns[$scope.currentPatternIdx];
            for (var i = 0; i < currentPattern.length - 1; i++) {
                currentPatternModel.push({
                    'from': currentPattern[i],
                    'to': currentPattern[i+1]
                });
            }

            $scope.model = currentPatternModel;
            $scope.currentPatternIdx++;
        }

        function initData() {
            for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    
                    // generate all the patterns from start point
                    var startPoint = { 'row': row, 'col': col };
                    var currentPointPatterns = getAvailablePatterns([startPoint], []);
                    $scope.patterns = $scope.patterns.concat(currentPointPatterns);
                    
                    // add the point to the board
                    $scope.dots.push(startPoint);
                }
            }
        }

        function getAvailablePatterns(visited, allPatterns) {
            if (visited.length >= 4) {
                allPatterns.push(visited);
            }
            if (visited.length === 9) {
                return;
            }
            var validNext = getNextValidPoints(visited);
            for (var i = 0; i < validNext.length; i++) {
                var currPatternVisited = visited.slice();
                currPatternVisited.push(validNext[i]);
                getAvailablePatterns(currPatternVisited, allPatterns);
            }
            return allPatterns;
        }

        function getNextValidPoints(visited) {
            var lastPoint = visited[visited.length - 1];
            var res = [];
            for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    var candidate = { 'row': row, 'col': col };
                    if (areEqual(candidate, lastPoint)) {
                        continue;
                    }
                    // TODO: take also non adjacent available nodes
                    if (isAdjacent(candidate, lastPoint) && notVisited(visited, candidate)) {
                        res.push(candidate);
                    }
                }
            }
            return res;
        }

        function areEqual(pointA, pointB) {
            return pointA.row === pointB.row && pointB.col === pointB.col;

        }

        function isAdjacent(pointA, pointB) {
            return Math.abs(pointA.row - pointB.row) <= 1 && Math.abs(pointA.col - pointB.col) <= 1;
        }

        function notVisited(points, point) {
            for (var i = 0; i < points.length; i++) {
                if (points[i].row === point.row && points[i].col === point.col) {
                    return false;
                }
            }
            return true;
        }


    }//LockPatternController
} ());

