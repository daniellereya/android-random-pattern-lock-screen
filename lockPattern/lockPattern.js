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
    LockPatternController.$inject = ["$scope"];
    function LockPatternController($scope) {

        $scope.model = [
        {
            'fromRow':0, 'fromCol':0, 
            'toRow':0, 'toCol':1 
         },
         {
            'fromRow':0, 'fromCol':1, 
            'toRow':1, 'toCol':1 
         },
         {
            'fromRow':1, 'fromCol':1, 
            'toRow':2, 'toCol':2 
         }
                      
        ];
            
        $scope.dots = [];

        $scope.getDotX = function (dot) {
            return 100 + dot.col * 400;
        };

        $scope.getDotY = function (dot) {
            return 100 + dot.row * 400;
        };

        $scope.getLineX = function(row, col) {
            var id = "#\\3" + row + " " + col;
            var relevantPointElement = angular.element( document.querySelector( id ) );
            var x = relevantPointElement.prop('cx');
            if (angular.isUndefined(x)) {
                return 0;
            }
            return x.baseVal.value;
        };
        
        $scope.getLineY = function(row, col) {
            var id = "#\\3" + row + " " + col;
            var relevantPointElement = angular.element( document.querySelector( id ) );
            var y = relevantPointElement.prop('cy');
            if (angular.isUndefined(y)) {
                return 0;
            }
            return y.baseVal.value;
        };
        

        initDots();

        function initDots() {
            for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    $scope.dots.push({
                        'row': row,
                        'col': col
                    });
                }
            }
        }


    }//LockPatternController
} ());

