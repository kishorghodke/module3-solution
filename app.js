(function() {
  'use strict';
 angular.module('NarrowItDownApp', [])
 .controller('NarrowItDownController',NarrowItDownController)
 .service('MenuSearchService',MenuSearchService)
 .directive('foundItem',FoundItem)
 .constant('path',"https://davids-restaurant.herokuapp.com")

 function FoundItem() {
         var ddo = {
             restrict: 'E',
             templateUrl: 'foundItem.html',
             scope: {
                 foundItem: '<',
                 onEmpty: '<',
                 onRemove: '&'
             },
             controller: NarrowItDownController,
             controllerAs: 'narrowit',
             bindToController: true
         };

         return ddo;
     }

     NarrowItDownController.$inject = ['MenuSearchService'];

     function NarrowItDownController(MenuSearchService) {
         var narrowit = this;
         narrowit.shortName = '';

         narrowit.matchedMenuItems = function(searchTerm) {
             var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

             promise.then(function(items) {
                 if (items && items.length > 0) {
                     narrowit.message = '';
                     narrowit.found = items;
                 } else {
                     narrowit.message = 'Nothing found!';
                     narrowit.found = [];
                 }
             });
         };

         narrowit.removeMenuItem = function(itemIndex) {
             narrowit.found.splice(itemIndex, 1);
         }
     }

     MenuSearchService.$inject = ['$http', 'path'];

     function MenuSearchService($http, path) {
         var service = this;

         service.getMatchedMenuItems = function(searchTerm) {
             return $http({
                 method: "GET",
                 url: (path + "/menu_items.json")
             }).then(function(response) {
                 var foundItems = [];

                 for (var i = 0; i < response.data['menu_items'].length; i++) {
                     if (searchTerm.length > 0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm) !== -1) {
                         foundItems.push(response.data['menu_items'][i]);
                     }
                 }

                 return foundItems;
             });
         };
     }


}) ();
