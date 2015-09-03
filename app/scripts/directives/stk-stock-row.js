'use strict';

angular.module('stockDogApp')
    .directive('stkStockRow', function ($timeout, QuoteService) {
        return {
            restrict: 'A',
            require: '^stkStockTable',
            scope: {
                stock: '=',
                isLast: '='
            },
           link: function($scope, $element, $attrs, stockTableCtrl) {
                // [3] Create tool-tip for stock row
                $element.tooltip({
                    placement: 'left',
                    title: $scope.stock.company.name
                });

                // [4] add this row to the TablCtrl
                stockTableCtrl.addRow($scope);

                // [5] Register this stock with the QuoteService
                QuoteService.register($scope.stock);

                // [6] Deregister company with the QuoteService on $destroy
                $scope.$on('$destroy', function() {
                    stockTableCtrl.removeRow($scope);
                    QuoteService.deregister($scope.stock);
                });

                // [7] If this is the last 'stock-row', fetch quotes immediately
                if ($scope.isLast) {
                    $timeout(QuoteService.fetch);
                }

                // [8] Watch for changes in shares and recalculate fields
                $scope.$watch('stock.shares', function() {
                    $scope.stock.marketValue = $scope.stock.shares * $scope.stock.lastPrice;
                    $scope.stock.dayChange = $scope.stock.shares * parseFloat($scope.stock.change);
                });
            }
        };
    });
