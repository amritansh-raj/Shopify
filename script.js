var myApp = angular.module("myApp", ["ui.router"]);

myApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/index");

  $stateProvider
    .state("index", {
      url: "/index",
      templateUrl: "index.html",
      controller: "indexController",
    })
    .state("login", {
      url: "/login",
      templateUrl: "template/login.html",
      controller: "loginController",
    })
    .state("register", {
      url: "/register",
      templateUrl: "template/register.html",
      controller: "indexController",
    });
});

myApp.controller("indexController", function ($scope) {
  $scope.showLoginPopup = function () {
    Swal.fire({
      title: "Login or Register",
      html: `
            <input type="text" id="username" class="swal2-input" placeholder="Username" required>
            <input type="password" id="password" class="swal2-input" placeholder="Password" required>
          `,
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Register",
      showLoaderOnConfirm: true,
      preConfirm: function () {
        var username = Swal.getPopup().querySelector("#username").value;
        var password = Swal.getPopup().querySelector("#password").value;

        if (!username || !password) {
          Swal.showValidationMessage("Please enter both username and password");
          return false;
        }

        console.log("Username:", username);
        console.log("Password:", password);
      },
      allowOutsideClick: function () {
        return !Swal.isLoading();
      },
    }).then(function (result) {
      if (result.dismiss === Swal.DismissReason.cancel) {
        $scope.showRegisterPopup();
      }
    });
  };

  $scope.showRegisterPopup = function () {
    Swal.fire({
      title: "Register",
      html: `
            <input type="text" id="username" class="swal2-input" placeholder="Username" required>
            <input type="email" id="email" class="swal2-input" placeholder="email@example.com" required>
            <input type="password" id="password" class="swal2-input" placeholder="Password">
            <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirm Password">
          `,
      showCancelButton: true,
      confirmButtonText: "Register",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: function () {
        var username = Swal.getPopup().querySelector("#username").value;
        var email = Swal.getPopup().querySelector("#email").value;
        var password = Swal.getPopup().querySelector("#password").value;
        var confirmPassword =
          Swal.getPopup().querySelector("#confirmPassword").value;

        if (!username || !email || !password || !confirmPassword) {
          Swal.showValidationMessage("Please fill all the fields");
          return false;
        }

        var emailField = Swal.getPopup().querySelector("#email");

        if (!validateEmail(email)) {
          // Validate email using the validateEmail function
          Swal.showValidationMessage("Invalid email address");
          return false;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage("Password does not match");
          return false;
        }

        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
      },
      allowOutsideClick: function () {
        return !Swal.isLoading();
      },
    }).then(function (result) {
      if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  };

  function validateEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  $(document).on("click", "#addItemBtn", function (event) {
    if (!userLoggedIn) {
      event.preventDefault();

      $scope.showLoginPopup();
    }
  });
});

myApp.controller("loginController", function ($scope) {});
