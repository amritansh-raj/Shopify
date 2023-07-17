var myApp = angular.module("myApp", ["ui.router"]);

myApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/index");

  $stateProvider.state("index", {
    url: "/index",
    templateUrl: "index.html",
    controller: "indexController",
  })
  .state("login", {
    url: "/login",
    templateUrl: "template/login.html",
    controller: "loginController",
  }).state("register", {
    url: "/register",
    templateUrl: "template/register.html",
    controller: "indexController",
   });
//    .state("index", {
//     url: "/index",
//     templateUrl: "index/html",
//     controller: "indexController",
//   });
});


// console.log("hello");