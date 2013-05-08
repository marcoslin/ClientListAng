/**
 * Create guiServices to be used by the controllers.
 */

/*globals angular */
/*jslint vars: true */

angular.module("guiServices", ['ngResource', "ui.bootstrap"])
    .factory('CacheTemplates', function ($http, $templateCache) {
        'use strict';
        return function () {
            /**
             * Load all the templates into cache on startup.  This speed up the app, but
             * more importantly, allow the angular-ui-bootstrap service to work even when
             * the web server is down.  Without the cache, the call to angular-ui-bootstrap
             * dies silently when template is not found.
             */
            var templs = [
                'template/list.html',
                'template/detail.html',
                'template/alert/alert.html',
                'template/dialog/message.html'
            ];
            templs.map(function (templ) {
                $http.get(templ).success(function (data) {
                    $templateCache.put(templ, data);
                });
            });
        };
    })
    .factory('Clients', function ($resource) {
        'use strict';
        var custom_resource =  $resource("/json/:id", {}, {
            query: { method: 'GET', isArray: true },
            get: { method: 'GET' },
            save: { method: 'PUT' },
            add: { method: 'POST' },
            remove: { method: 'DELETE'}
        });
        custom_resource.prototype.add_update = function (clients) {
            var self = this;
            this.$add(function () {
                clients.push(self);
            });
        };
        return custom_resource;
    })
    .factory("Confirm", function ($dialog) {
        'use strict';
        return function (title) {
            var message = "Proceed?";
            var buttons = [ { result: 'ok', label: 'Ok', cssClass: 'btn-primary confirm-ok'}, { result: 'cancel', label: 'Cancel', cssClass: 'confirm-cancel'} ];
            return $dialog.messageBox(title, message, buttons);
        };
    })
    .factory("AlertService", function () {
        'use strict';
        /**
         * Wrapper for show alert.  Ideally, it should work as:
         *   Alert.$error("...");
         *
         * But as there is no easy way to inject current $scope into service,
         * it would have to be implemented as:
         *     Alert($scope).$error("...");
         *
         * The final implementation is cleaner:
         *     var alert = AlertService($scope);
         *     alert.$error("...");
         */
        var ShowAlert = function ($scope) {
            this.scope = $scope;
        };
        ShowAlert.prototype.$error = function (message) {
            this.scope.alerts = [ { type: "error", msg: message } ];
        };
        ShowAlert.prototype.$resource_error = function (message, resource_error) {
            /**
             * Handle RESTful server error returned by $resource.  If server is not running the error returned by $resource is:
             *   error = { status: 0, data: ""};
              */
            var error_message = "";
            if (resource_error.data) {
                error_message = message + "  Server message: '" + resource_error.data + "'";
            } else {
                error_message = message + "  Make sure that server is running.";
            }
            this.$error(error_message);
        };
        ShowAlert.prototype.$success = function (message) {
            this.scope.alerts = [ { type: "success", msg: message} ];
        };
        return function ($scope) {
            $scope.alerts = [];
            return new ShowAlert($scope);
        };
    });




/**
 * Initialize angular application and pre-cache the template
 */
var client_app = angular.module("client.app", ["guiServices"])
    .run(function (CacheTemplates) {
        'use strict';
        CacheTemplates();
    });




/**
 * Configure Application Route
 */
client_app.config(function ($routeProvider) {
    'use strict';
    $routeProvider.
        when("/list", { templateUrl: "template/list.html", controller: 'ClientListController' }).
        when("/add", { templateUrl: "template/detail.html", controller: 'ClientController', form_mode : 'add' }).
        when("/:id", { templateUrl: "template/detail.html", controller: 'ClientController', form_mode : 'edit' }).
        otherwise({redirectTo: '/list'});
});




/**
 * Configure Controllers
 */
client_app.controller('ClientListController', function ($scope, Clients, Confirm, AlertService) {
    'use strict';
    // Handle Alert
    var alert = AlertService($scope);
    // Read the list of client from url
    $scope.clients = Clients.query(
        angular.noop,
        function (error) {
            alert.$resource_error("Failed to load client list.", error);
        }
    );
    // Define sort by
    $scope.sortBy = "first_name";
    $scope.sortDesc = false;
    // Handle Alert
    $scope.alerts = [];

    // Delete client
    var removeClient = function (object_id, callback) {
        // callback will return a client_deleted flag
        var clients = $scope.clients;

        // function to actually remove the client
        // Created to make jslint happy for not creating function in a loop,
        // even if in this case should not be a problem.
        var delClient = function (client) {
            var client_full_name = client.first_name + " " + client.last_name;
            client.$remove(
                { id: client.object_id },
                function () {
                    alert.$success("'" + client_full_name + "' deleted ");
                    clients.splice(i, 1);
                    if (callback) {
                        callback(true);
                    }
                },
                function (error) {
                    alert.$resource_error("Failed to delete '" + client_full_name + "'.", error);
                    if (callback) {
                        callback(false);
                    }
                }
            );
        };

        // Search for client to delete for given id
        for (var i = 0; i < clients.length; i += 1) {
            var client = clients[i];
            if (client.object_id === object_id) {
                delClient(client);
                break;
            }
        }
    };

    $scope.askToRemoveClient = function (object_id, full_name, callback) {
        // Callback is used for unit testing to confirm that clients array has be updated correctly
        Confirm("About to delete '" + full_name + "'.")
            .open()
            .then(function (result) {
                if (result === "ok") {
                    removeClient(object_id, callback);
                }
            });
    };

    // Close Alert
    $scope.closeAlert = function () {
        $scope.alerts = [];
    };

    // Quick Add is to illustrate how to extend $resource and update the scope variable
    // when resource action succeeds
    $scope.quickAdd = function () {
        var client = new Clients();
        client.first_name = "New";
        client.last_name = "Client";
        client.add_update($scope.clients);
    };

});

client_app.controller('ClientController', function ($scope, $route, $routeParams, $location, Clients, AlertService) {
    'use strict';
    // Handle Alert
    var alert = AlertService($scope);

    // Add client to the list
    var addAction = function () {
        $scope.client.$add(
            function (data) {
                //console.log("addAction success data: ", data);
                alert.$success("New client '" + $scope.client.first_name + " " + $scope.client.last_name + "' added.");
            },
            function (error) {
                alert.$resource_error("Failed to add a new client.", error);
            }
        );
    };

    // Save clients
    var saveAction = function () {
        $scope.client.$save(
            { id: $routeParams.id },
            function () {
                alert.$success("'" + $scope.client.first_name + " " + $scope.client.last_name + "' updated.");
                $location.path("#/list");
            },
            function (error) {
                alert.$resource_error("Failed to save the client.", error);
            }
        );
    };

    // Configure scope based on form mode
    if ($route.current.form_mode === 'add') {
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
            angular.noop,
            function (error) {
                alert.$resource_error("Failed to retrieve client detail.", error);
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
