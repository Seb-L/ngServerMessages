'use strict';

angular.module('ngServerMessages', [])

	// Intercept http request and broadcast events
	// ---------------------------------------------------------------------
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push(function($rootScope, $q){
			return {
				'request': function(config) {
					$rootScope.$broadcast('server.request.ok', config);
					return config;
				},
				'requestError': function(rejection) {
					$rootScope.$broadcast('server.start.error', rejection);
					return $q.reject(rejection);
				},
				'response': function(response) {
					$rootScope.$broadcast('server.response.ok', response);
					return response;
				},
				'responseError': function(rejection) {
					$rootScope.$broadcast('server.response.error', rejection);
					return $q.reject(rejection);
				}
			}
		});
	})

	// Parent directive to get the current endpoint
	// ---------------------------------------------------------------------
	.directive('ngServerMessages', function(){
		return {
			restrict: 'A',
			require: 'ngServerMessages',
			controller: function($scope, $attrs, $rootScope){
				this.endpoint = $attrs.ngServerMessages;
			}
		};
	})

	// Handle messages visibility based on http status
	// ---------------------------------------------------------------------
	.directive('ngServerMessage', function(){
		return {
			restrict: 'A',
			require: '^ngServerMessages',
			link: function(scope, element, attrs, ctrl) {
				element.css({'display': 'none'});
				
				scope.$on('server.request.ok', function(event, args){
					process(args.headers['X-ng-service-name'], null, true);
				});
				scope.$on('server.response.ok', function(event, args){ 
					process(args.config.headers['X-ng-service-name'], args.status);
				});
				scope.$on('server.response.error', function(event, args){ 
					process(args.config.headers['X-ng-service-name'], args.status);
				});

				function process(name, status, forceHidden){
					if(name === ctrl.endpoint){
						if(status === parseInt(attrs.ngServerMessage)){
							element.css({'display': 'block'});
						}
						if(!!forceHidden){
							element.css({'display': 'none'});
						}
					}
				}
			}
		};
	})

	// Handle loading message visibility
	// ---------------------------------------------------------------------
	.directive('ngServerMessageLoading', function(){
		return {
			restrict: 'A',
			require: '^ngServerMessages',
			link: function(scope, element, attrs, ctrl) {
				element.css({'display': 'none'});
				
				scope.$on('server.request.ok', function(event, args){ 
					toggle(args.headers['X-ng-service-name'], true);
				});
				scope.$on('server.response.ok', function(event, args){ 
					toggle(args.config.headers['X-ng-service-name'], false);
				});
				scope.$on('server.response.error', function(event, args){ 
					toggle(args.config.headers['X-ng-service-name'], false);
				});

				function toggle(name, vivibility){
					if(name === ctrl.endpoint){
						vivibility ? element.css({'display': 'block'}) : element.css({'display': 'none'});
					}
				}
			}
		};
	})

	// Handle default message (when no request sent yet)
	// ---------------------------------------------------------------------
	.directive('ngServerMessageDefault', function() {
		return {
			restrict: 'A',
			require: '^ngServerMessages',
			link: function(scope, element, attrs, ctrl) {
				element.css({'display': 'block'});

				scope.$on('server.request.ok', function(event, args) {
					process(args.headers['X-ng-service-name']);
				});
				scope.$on('server.response.ok', function(event, args) {
					process(args.config.headers['X-ng-service-name']);
				});
				scope.$on('server.response.error', function(event, args) {
					process(args.config.headers['X-ng-service-name']);
				});

				function process(name) {
					if (name === ctrl.endpoint) {
						element.css({'display': 'none'});
					}
				}
			}
		};
	});