/* global angular */
(function () {
    "use strict";

    angular.module("components.lockPattern", [])
        .directive("lockPattern", lockPattern);

    lockPattern.$inject = [];
    function lockPattern() {
        var directive = {
            restrict: "E",
            templateUrl: "lockPattern/lockPattern.html",
            controller: LockPatternController
        };
        return directive;
    }//directive
    /// Directive Controller ///////////////////////////////////
    LockPatternController.$inject = ["$scope", "$interval"];
    function LockPatternController($scope, $interval) {

        $scope.dots = [];
        $scope.patterns = [];
        $scope.isRunning = false;
        $scope.showNumbers = false;
        $scope.currentPatternIdx = 0;
        var drawPatternIntervalPromise = null;

        initData();

        /** Dots and Lines positioning */
        $scope.getDotX = function (dot) {
            return 100 + dot.col * 400;
        };

        $scope.getDotY = function (dot) {
            return 100 + dot.row * 400;
        };

        $scope.getLineX = function (row, col) {
            return getDotProperty(row, col, 'cx');
        };

        $scope.getLineY = function (row, col) {
            return getDotProperty(row, col, 'cy');
        };

        function getDotProperty(row, col, propName) {
            var id = "#\\3" + row + " " + col;
            var relevantPointElement = angular.element(document.querySelector(id));
            var prop = relevantPointElement.prop(propName);
            if (angular.isUndefined(prop)) {
                return 0;
            }
            return prop.baseVal.value;
        }

        /** Click Handlers */
        $scope.startStopClicked = function () {
            if ($scope.isRunning) {
                if (drawPatternIntervalPromise !== null) {
                    $interval.cancel(drawPatternIntervalPromise);
                    console.log("Stopped...");
                }

            } else {
                console.log("Starting...");
                drawPatternIntervalPromise = $interval(changePattern, 50);
            }
            $scope.isRunning = !$scope.isRunning;
        };

        $scope.showHideClicked = function () {
            $scope.showNumbers = !$scope.showNumbers;
        };

        /** Patterns Handling */
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

        function changePattern() {
            var currentPatternModel = [];
            if ($scope.patterns.length - 1 < $scope.currentPatternIdx) {
                $interval.cancel(drawPatternIntervalPromise);
                $scope.isRunning = false;
                console.log("Finished drawing patterns");
                return;
            }
            var currentPattern = $scope.patterns[$scope.currentPatternIdx];
            for (var i = 0; i < currentPattern.length - 1; i++) {
                currentPatternModel.push({
                    'from': currentPattern[i],
                    'to': currentPattern[i + 1]
                });
            }

            $scope.model = currentPatternModel;
            $scope.currentPatternIdx++;
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
                    if (notVisited(visited, candidate)) {
                        if (isAdjacent(candidate, lastPoint)) {
                            // not visited, adjacent
                            res.push(candidate);
                        } else if (isValidNotAdjacent(candidate, lastPoint, visited)) {
                            // not visited, not adjacent
                            res.push(candidate);

                        }
                    }
                }
            }
            return res;
        }

        function areEqual(pointA, pointB) {
            return pointA.row === pointB.row && pointA.col === pointB.col;
        }

        function isAdjacent(pointA, pointB) {
            return Math.abs(pointA.row - pointB.row) <= 1 && Math.abs(pointA.col - pointB.col) <= 1;
        }

        function isValidNotAdjacent(pointA, pointB, visited) {
            var rowDiff = Math.abs(pointA.row - pointB.row);
            var colDiff = Math.abs(pointA.col - pointB.col);
            var midPointRow = (pointA.row + pointB.row) / 2;
            var midPointCol = (pointA.col + pointB.col) / 2;
            var a = rowDiff === 2 && colDiff === 1;
            var b = rowDiff === 1 && colDiff === 2;
            var c = (rowDiff === 2 && colDiff === 0) &&
                (isVisited(visited, midPointRow, midPointCol));
            var d = (rowDiff === 0 && colDiff === 2) &&
                (isVisited(visited, midPointRow, midPointCol));
            var e = (rowDiff === 2 && colDiff === 2) &&
                (isVisited(visited, midPointRow, midPointCol));
            return a || b || c || d || e;
        }

        function notVisited(points, point) {
            return !isVisited(points, point.row, point.col);
        }

        function isVisited(points, row, col) {
            for (var i = 0; i < points.length; i++) {
                if (points[i].row === row && points[i].col === col) {
                    return true;
                }
            }
            return false;
        }

    }//LockPatternController
} ());

