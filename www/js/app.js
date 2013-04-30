// Configure Service to access JSON provider
angular.module("guiServices", ['ngResource', "ui.bootstrap"])
	.factory('Clients', function($resource){
		return $resource("/json/:id", {}, {
			query: { method:'GET', isArray:true },
			get: { method:'GET' },
			save: { method: 'PUT' },
			add: { method:'POST' },
			remove: { method:'DELETE'}
		});
	})
	.factory("Confirm", function($dialog) {
        return function (title) {
            var message = "Proceed?";
            var buttons = [ { result:'ok', label:'Ok', cssClass:'btn-primary confirm-ok'}, { result:'cancel', label:'Cancel', cssClass:'confirm-cancel'} ];
            return $dialog.messageBox(title, message, buttons);
        };
	});

// Initialize application
client_app = angular.module("client.app", ["guiServices", "ui.bootstrap"])

// Configure Routes
client_app.config(function ($routeProvider) {
	$routeProvider.
		when("/list", { templateUrl: "template/list.html", controller: 'ClientListController' }).
		when("/add", { templateUrl: "template/detail.html", controller: 'ClientController', form_mode : 'add' }).
		when("/:id", { templateUrl: "template/detail.html", controller: 'ClientController', form_mode : 'edit' }).
		otherwise({redirectTo: '/list'});
});

// Configure Controller
client_app.controller('ClientListController', function ($scope, Clients, Confirm) {
	// Read the list of client from url
	$scope.clients = Clients.query();
	// Define sort by
	$scope.sortBy = "first_name";
	$scope.sortDesc = false;


	// Delete client
	$scope.removeClient = function (object_id, full_name) {
        Confirm("About to delete '" + full_name + "'.")
            .open()
            .then( function (result) {
                if ( result == "ok" ){
                    var index_to_remove = -1;
                    for ( var i = 0; i < $scope.clients.length; i++) {
                        var c = $scope.clients[i];
                        if ( c["object_id"] == object_id ) {
                            index_to_remove = i;
                            break;
                        };
                    };

                    var client_to_remove = new Clients();
                    client_to_remove.$remove({ id: object_id });

                    if ( index_to_remove >= 0 ) {
                        $scope.clients.splice(index_to_remove, 1);
                    };
                }
            });
	};
});

client_app.controller('ClientController', function ($scope, $route, $routeParams, $location, Clients) {
    // Handle Alert
    $scope.alerts = [];
    var showAlert = function (type, message ) {
        var alert = { type: type, msg: message };
        //console.log("Alert Message " + alert.msg );
        $scope.alerts = [ alert ];
    };

    // Add client to the list
    var addAction = function () {
        $scope.client.$add(
            function () {
                showAlert( "success", "New client '" + $scope.client.first_name + " " + $scope.client.last_name + "' added." );
            },
            function (error) {
                showAlert( "error", "Error adding new client.  Server message: '" + error["data"] + "'" );
            }
        );
    };

    // Save clients
    var saveAction = function () {
        $scope.client.$save(
            { id: $routeParams.id },
            function () {
                showAlert( "success", "'" + $scope.client.first_name + " " + $scope.client.last_name + "' updated." );
                $location.path("#/list");
            },
            function (error) {
                showAlert( "error", "Error saving client.  Server message: '" + error["data"] + "'" );
            }
        );
    };

    // Configure scope based on form mode
    if ( $route.current.form_mode == 'add' ) {
        $scope.form_title = "Add a New Client";
        $scope.form_submit_caption = "Add";
        $scope.formSubmitAction = addAction;

        $scope.client = new Clients();
    } else {
        $scope.form_title = "Edit Client";
        $scope.form_submit_caption = "Save";
        $scope.formSubmitAction = saveAction;

        $scope.client = Clients.get(
            { id: $routeParams.id },
            function () {},
            function (error) {
                showAlert( "error", "Error retrieving client detail.  Server message: '" + error["data"] + "'" );
            }
        );
    }

    // Close Alert
    $scope.closeAlert = function () {
        $scope.alerts = [];
    };

	// Cancel
	$scope.cancelAction = function () {
		$location.path("#/list");
	};

});
