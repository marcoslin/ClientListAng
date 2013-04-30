'use strict';

/* jasmine specs for controllers go here */
describe('client.app', function() {
	
	// Need to load module to be used.  By default, on ng module is loaded.
	beforeEach(module("client.app"));

	// Override the default Confirm service to return always true
	var confirm_text = "";
	beforeEach(
		module( function ($provide) {
			$provide.factory('Confirm', function () {
                var mock_then = {
                    then: function (callback) {
                        callback("ok")
                    }
                }
                var mock_open = {
                    open: function () {
                        return mock_then;
                    }
                };
                return function (title) {
                    confirm_text = title;
                    //console.log("Return ok for '" + title + "'")
                    return mock_open;
                };
			})
		})
	);

	// Create a default list of client for testing
	var testClients = [
		{ "object_id": 1, "first_name": "Carla", "last_name": "Musselwhite", "city": "Rome", "post_code": "00151" },
		{ "object_id": 2, "first_name": "Jona", "last_name": "Dino", "city": "Rome", "post_code": "00177" },
		{ "object_id": 3, "first_name": "Shala", "last_name": "Schwartz", "city": "New York", "post_code": "20142" },
		{ "object_id": 4, "first_name": "Susie", "last_name": "Boman", "city": "New York", "post_code": "20130" },
		{ "object_id": 5, "first_name": "Andree", "last_name": "Yousef", "city": "London", "post_code": "SW7 151" }
	];

    // Function used to retrive client by id
    var get_client = function (object_id) {
        for (var i = 0; i < testClients.length; i++) {
            var client = testClients[i];
            if ( client.object_id == object_id ) {
                return client;
            };
        };
    };

    /**
	 *
	 * Testing the ClientListController
	 *
	 */
	describe('ClientListController', function(){
		var scope;
		
		beforeEach(
			inject(function ($rootScope, $controller, $httpBackend) {
				scope = $rootScope.$new();
				$httpBackend.whenGET('/json').respond(testClients);
				$httpBackend.whenDELETE(/\/json\/\d+/).respond();
				var ctrl = $controller("ClientListController", { $scope: scope});
				$httpBackend.flush();
				// Clear the Confirm Service Text
				confirm_text = ""
			})
		);
		
		it('clients should be initialized with full population.', function() {
			expect(scope.clients.length).toBe(testClients.length);
		});
		
		it('deleting a client from the middle of array.', function() {
			// Delete second item, make sure that Confirm service is called with the name to delete
			// and make sure that new second item has id of 3
			scope.removeClient(2, "Jona Dino");
			expect(confirm_text).toMatch(/Jona Dino/);
			expect(scope.clients[1].object_id).toBe(3);
			expect(scope.clients.length).toBe(testClients.length - 1);
		});

		it('deleting first and last clients from the array', function() {
			// Delete first item and make sure that new first item has id of 2
			scope.removeClient(1, "Carla Musselwhite");
			expect(scope.clients[0].object_id).toBe(2);
			// Delete the last item and make sure that new last item has id of 4
			scope.removeClient(5, "Andree Yousef");
			expect(scope.clients[2].object_id).toBe(4);
			// Final legth should have 2 less items
			expect(scope.clients.length).toBe(testClients.length - 2);
		});
		
	});
	
	/**
	 *
	 * Testing the ClientController
	 * 
	 */
	describe('ClientController', function(){
		var scope, httpBackend;
        beforeEach(
            inject(function ($rootScope, $httpBackend) {
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
            })
        );

        describe('EDIT', function () {
            var client, object_id;
            beforeEach(
                inject(function ($controller) {
                    var current = { form_mode: "edit" };

                    object_id = 2;
                    client = get_client(object_id);

                    httpBackend.whenGET("/json/" + object_id).respond(client);
                    var ctrl = $controller("ClientController", { $scope: scope, $routeParams : { id: object_id }, $route: { current: current } });
                    httpBackend.flush();
                })
            );

            it("check the client name is correct.", function () {
                expect(scope.client.first_name).toBe(client.first_name);
                expect(scope.client.last_name).toBe(client.last_name);
            });

            it("updating a client should be done via PUT with object_id", function () {
                httpBackend.expectPUT("/json/" + object_id).respond();
                scope.client.first_name = "Sergey";
                scope.client.last_name = "Simonckik";
                scope.formSubmitAction();
                httpBackend.flush();

                var alert = scope.alerts[0];
                expect(alert.msg).toMatch(/Sergey Simonckik.+updated\.$/);

            });

        });

        describe('ADD', function () {
            beforeEach(
                inject(function ($rootScope, $controller, $httpBackend) {
                    var current = { form_mode: "add" };
                    var ctrl = $controller("ClientController", { $scope: scope, $route: { current: current } });
                })
            );

            it("adding a client should be done via POST", function () {
                httpBackend.expectPOST("/json").respond();
                scope.client.first_name = "Benjamin";
                scope.client.last_name = "Lesh";
                scope.formSubmitAction();
                httpBackend.flush();

                var alert = scope.alerts[0];
                expect(alert.msg).toMatch(/Benjamin Lesh.+added\.$/);
            });
        });
		
	});

});
