var myApp = angular.module("myApp", ["ui.router"]);
userLoggedIn = false;
var apiUrl = "http://10.21.82.46:8000";

myApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/Home");

  $stateProvider
    .state("Home", {
      url: "/Home",
      templateUrl: "index.html",
      controller: "indexController",
    })
    .state("Products", {
      url: "/Products",
      templateUrl: "template/products.html",
      controller: "productController",
    })
    .state("category", {
      url: "/Category",
      templateUrl: "template/category.html",
      controller: "categoryController",
    })
    .state("manager", {
      url: "/manager",
      templateUrl: "template/manager.html",
      controller: "managerController",
    });
});

myApp.controller("indexController", function ($scope, $http) {
  $scope.showLoginPopup = function () {
    Swal.fire({
      title: `<p class="text-center h1 fw-bold mb-3 mx-1 mx-md-4 mt-4">
      Login or Register
    </p>`,
      html: `
      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          id="username"
          placeholder="Username"
        />
        <label >Email</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          id="password"
        />
        <label>Password</label>
      </div>
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

        var loginData = {
          username: username,
          password: password,
        };

        console.log(loginData);

        $http
          .post(apiUrl + "/shopify/login", loginData)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log("error", error);
          });
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
        <div class="form-floating mb-3">
            <input type="text" id="username" class="form-control" placeholder="Username">
            <label >Username</label>
        </div>
        <div class="form-floating mb-3">
            <input type="email" id="email" class="form-control" placeholder="email@example.com">
            <label >Email</label>
        </div>
        <div class="form-floating mb-3">
            <input type="tel" id="contact" class="form-control" placeholder="Phone no">
            <label >Phone no</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" id="address" class="form-control" placeholder="Address">
            <label >Address</label>
        </div>
        <div class="form-floating mb-3">
            <input type="password" id="password" class="form-control" placeholder="Password">
            <label >Password</label>
        </div>
        <div class="form-floating mb-3">
            <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm Password">
            <label >Confirm Password</label>
        </div>
          `,
      showCancelButton: true,
      confirmButtonText: "Register",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: function () {
        var username = Swal.getPopup().querySelector("#username").value;
        var email = Swal.getPopup().querySelector("#email").value;
        var contact = Swal.getPopup().querySelector("#contact").value;
        var address = Swal.getPopup().querySelector("#address").value;
        var password = Swal.getPopup().querySelector("#password").value;
        var confirmPassword =
          Swal.getPopup().querySelector("#confirmPassword").value;

        if (
          !username ||
          !email ||
          !password ||
          !confirmPassword ||
          !contact ||
          !address
        ) {
          Swal.showValidationMessage("Please fill all the fields");
          return false;
        }

        if (!validateEmail(email)) {
          Swal.showValidationMessage("Invalid email address");
          return false;
        }

        if (!validateContact(contact)) {
          Swal.showValidationMessage("Invalid Contact");
          return false;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage("Password does not match");
          return false;
        }

        var registerData = {
          username: username,
          email: email,
          contact: contact,
          address: address,
          password: password,
          confirmPassword: confirmPassword,
        };

        $http
          .post(apiUrl + "/shopify/register", registerData)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log("error", error);
          });

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

  function validateContact(contact) {
    var contactPattern = /\s*[1-9]{1}[0-9]{9}\s*/;
    return contactPattern.test(contact);
  }

  $(document).on("click", "#addItemBtn", function (event) {
    if (!userLoggedIn) {
      event.preventDefault();

      $scope.showLoginPopup();
    }
  });
});

myApp.controller("managerController", function ($scope) {
  $scope.panels = [{ showDropdown: false }, { showDropdown: false }];

  $scope.toggleDropdown = function (panel) {
    panel.showDropdown = !panel.showDropdown;
  };
});
