var myApp = angular.module("myApp", ["ui.router", "ngCookies"]);
var apiUrl = "https://10.21.83.174:8000/shopify/";

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
    })
    .state("addProduct", {
      url: "/addProduct",
      templateUrl: "template/addProduct.html",
      controller: "addProductController",
    });
});

myApp.factory("alertService", [
  "$rootScope",
  "$timeout",
  function ($rootScope, $timeout) {
    var alertService = {
      add: function (type, msg, section) {
        if (section === undefined) section = 1;
        $rootScope.alerts.push({
          type: type,
          msg: msg,
          section: section,
          close: function () {
            return alertService.closeAlert(this);
          },
        });
      },

      closeAlert: function (alert) {
        this.closeAlertIdx($rootScope.alerts.indexOf(alert));
      },
      closeAlertIdx: function (index) {
        return $rootScope.alerts.splice(index, 1);
      },
      clear: function () {
        $rootScope.alerts = [];
      },
    };

    $rootScope.$on("$stateChangeSuccess", function () {
      alertService.clear();
    });

    $rootScope.alerts = [];

    return alertService;
  },
]);

myApp.controller("indexController", [
  "$scope",
  "$http",
  "$state",
  function ($scope, $http, $state) {
    $scope.userLoggedIn = false;

    $scope.showLoginPopup = function () {
      Swal.fire({
        title: `<p class="text-center h1 fw-bold mb-3 mx-1 mx-md-4 mt-4">
      Login or Register
    </p>`,
        html: `
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="username"
          placeholder="Username"
        />
        <label >Username</label>
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
            Swal.showValidationMessage(
              "Please enter both username and password"
            );
            return false;
          }

          var loginData = {
            username: username,
            password: password,
          };

          $http({
            method: "POST",
            url: apiUrl + "login/",
            data: loginData,
            withCredentials: true,
          })
            .then(function (response) {
              $scope.userLoggedIn = true;

              var verify = response.data.is_superuser;
              superuser = verify;

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

    $scope.logout = function () {
      $scope.userLoggedIn = false;

      $http({
        method: "GET",
        url: apiUrl + "logout/",
        withCredentials: true,
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      $state.go("Home");
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

    $(document).on("click", "#loginBtn", function (event) {
      event.preventDefault();

      $scope.showLoginPopup();
    });
  },
]);

myApp.controller("managerController", [
  "$scope",
  "$http",
  "$state",
  "alertService",
  function ($scope, $http, $state, alertService) {
    alertService.add("success", "Welcome to your dashboard", 1);

    $scope.categories = [];

    $http({
      method: "GET",
      url: apiUrl + "getcategory/",
      withCredentials: true,
    })
      .then(function (response) {
        console.log(response);
        var categories = response.data;

        if (categories) {
          $scope.categories = categories;
        }

        console.log($scope.categories);
      })
      .catch(function (error) {
        if (error.data && error.data.message) {
          // $window.alert(error.data.message);
        } else {
          // $window.alert("An error occured. Please try again");
        }
      });

    $scope.edit = function(category) {
      if ($scope.editingCategory) {
        $scope.cancelEdit($scope.editingCategory);
      }

      // var updatedImageInput = angular.element(document.querySelector("#updatedImage").files[0]);
      // if (updatedImageInput.length > 0) {
      //   category.updateImage = updatedImageInput[0].files[0];
      //   console.log(category.updateImage);
      // }

      // console.log(category.updatedImageInput);

    category.editMode = true;
    $scope.editingCategory = category;
    category.updateName = category.category_name; 
    category.updateImage = category.category_image;

    };

    
    $scope.cancelEdit = function(category) {
      category.editMode = false;
      category.updateName = category.category_name; 
      category.updateImage = category.category_image;
    };    

    $scope.saveEdit = function(category){

      if(category.updateName){
        category.category_name = category.updateName;
        category.category_image = category.updateImage;
      }

      var testImage = document.getElementById("updatedImage").files[0];      

      var formData = new FormData();
      formData.append("category_name", category.updateName);
      formData.append("category_image", testImage);
      formData.append("id", category.id)

      console.log(formData);

      $http({
        method: "POST",
        url: apiUrl + "editcategory/",
        withCredentials: true,
        data: formData,
        headers: { "Content-Type": undefined },
      })
        .then(function(response){
          console.log(response);
        })
        .catch(function(error){
          console.log(error);
        })
    }

    $scope.delete = function(category){

      $http({
        method: "DELETE",
        url: apiUrl + "addcategory/",
        withCredentials: true,
        data: {id: category.id}
      })
        .then(function(response){
          console.log("deleted");
        })
        .catch(function(error){
          console.log(error);
        })
    }

    $scope.showCreateSection = function (event) {
      event.preventDefault();

      Swal.fire({
        title: "Create Section",
        html: `<div class="input-group">
    <div class="custom-file">
      <input type="text" class="section-name" id="sectionName">
      <input type="file" class="custom-file-input" id="sectionImage" accept="image/*">
    </div>
  </div>`,
        confirmButtonText: "Create",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then(function (result) {
        if (result.isConfirmed) {
          var sectionName = document.getElementById("sectionName").value;
          var sectionImage = document.getElementById("sectionImage").files[0];

          var formData = new FormData();
          formData.append("category_name", sectionName);
          formData.append("category_image", sectionImage);

          console.log(formData);

          $http({
            method: "POST",
            url: apiUrl + "addcategory/",
            withCredentials: true,
            data: formData,
            headers: { "Content-Type": undefined },
          })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      });
    };

    $scope.logout = function () {
      $scope.userLoggedIn = false;

      $http({
        method: "GET",
        url: apiUrl + "logout/",
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      $state.go("Home");
    };
  },
]);

myApp.controller("cartController", function ($scope) {

});

myApp.controller("addProductController", function ($scope) {

});

myApp.controller("categoryController", function($scope){

})