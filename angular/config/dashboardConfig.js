angular.module("dashBoard", ["ngRoute","profileController", "HelpController",
"companyDetailController","projectDetailController","createProjectController","fileUploadDirective",
"companyService","serverController","manageUsersController","mfaPageController"]).config(
function($routeProvider){
	$routeProvider
	.when("/", {
        templateUrl : "pages/companyDetails.html",
        controller : "profileController"
    })
    .when("/project", {
        templateUrl : "pages/projectDetails.html",
        controller : "companyDetailController"
    })
    .when("/server", {
        templateUrl : "pages/serverDetails.html",
        controller : "serverController"
    })
    .when("/profile", {
        templateUrl : "pages/userProfile.html",
        controller : "profileController"
    })
    .when("/mfa", {
        templateUrl : "pages/mfaPage.html",
        controller : "mfaPageController"
    })
    .when("/users", {
        templateUrl : "pages/manageUsers.html",
        controller : "manageUsersController"
    })
    .otherwise({
        redirectTo : "/"
    });
});