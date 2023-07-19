var myApp = angular.module("myApp", ["ui.router","ngCookies"]);
var apiUrl = "http://10.21.82.46:8000/shopify/";
// var apiUrl = "http://10.21.81.203:8000/"

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
    })
    .state("Cart", {
      url: "/cart",
      templateUrl: "template/cart.html",
      controller: "cartController",
    });
});

myApp.controller("indexController", function ($scope, $http, $state, $cookies) {

  $scope.userLoggedIn = false;

    var authToken = $cookies.get('authToken');
    if(authToken){
      $scope.userLoggedIn = true;
    }

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

        $http({
          method: "POST",
          // url: apiUrl + "custom_login/",
          url: apiUrl + "login/",
          data: loginData,
        })
          .then(function (response) {
            $scope.userLoggedIn = true;
            var authToken = response.data.authToken;
            $cookies.put('authToken', authToken);

            var register = response.data.authenticate_id;
            superuser = register;

            console.log(response);
            if (superuser) {
              $state.go("manager");
            } else {
              $state.go("Home");
            }
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

    $(document).on("click", "#addItemBtn", function (event) {
      event.preventDefault();
  
      $scope.showLoginPopup();
    });
  };

  $scope.logout = function(){
    $scope.userLoggedIn = false;

    $http({
      method: "GET",
      url: apiUrl + 'logout/',
    }).then(function(response){
      console.log(response);
    })
    .catch(function(error ){
      console.log(error);
    })
    $state.go("Home");
  }

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
          return;
        }

        if (!validateEmail(email)) {
          Swal.showValidationMessage("Invalid email address");
          return;
        }

        if (!validateContact(contact)) {
          Swal.showValidationMessage("Invalid Contact");
          return;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage("Password does not match");
          return;
        }

        var registerData = {
          username: username,
          email: email,
          contact: contact,
          address: address,
          password: password,
          confirmPassword: confirmPassword,
        };

        $http({
          method: "POST",
          url: apiUrl + "register/",
          data: registerData,
        })
          .then(function (response) {
            userLoggedIn = true;
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
    event.preventDefault();

    $scope.showLoginPopup();
  });
});

myApp.controller("managerController", function ($scope, $http, $cookies, $window) {

  $scope.showCreateSection = function (event) {
    event.preventDefault();

    if (!$cookies.get('authToken')) {
      $window.location.href = '/login'; 
      return;
    }

    Swal.fire({
      title: "Create Section",
      html: `<input id="sectionImage" type="file" class="swal2-file" accept="image/*">`,
      confirmButtonText: "Create",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then(function (result) {
      if (result.isConfirmed) {
        var sectionImage = document.getElementById("sectionImage").files[0];

        var formData = new FormData();
        formData.append('sectionImage', sectionImage);

        $http({
          method: 'POST',
          // url: apiUrl + 'add_section/',
          url: apiUrl + 'addcategory/',
          headers: {
            'Content-Type': undefined,
            'Authorization': 'Bearer ' + $cookies.get('authToken')
          },
          transformRequest: angular.identity,
          data: formData
        })
          .then(function (response) {
            console.log(response.data);
            
            if (response.data.authenticate_id) {
              $cookies.put('authToken', response.data.authenticate_id);
              console.log("User is authenticated");
            } else {
              
              console.log("User is not authenticated");
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    });
  };
});


myApp.controller("cartController" , function($scope){

});

