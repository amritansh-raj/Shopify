var myApp = angular.module("myApp", ["ui.router"]); 
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

myApp.controller("indexController", function ($scope, $http, $state) {

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
            method: 'POST',
            url: 'http://10.21.82.46:8000/shopify/login/',
            data: loginData
          })
          .then(function (response) {
            var register = (response.data.superuser);
            superuser = register;

            if(superuser){
                $state.go("manager");
            } else{
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
            method: 'POST',
            url: 'http://10.21.82.46:8000/shopify/register/',
            data: registerData
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

myApp.controller("managerController", function ($scope) {
    $scope.showCreateSection = function (event) {
      event.preventDefault();
  
      Swal.fire({
        title: 'Create Section',
        html:
          '<div id="dropZone" style="border: 2px dashed gray; padding: 20px; text-align: center;">' +
          '  <p>Drag and drop an image file here</p>' +
          '</div>' +
          '<input id="sectionName" class="swal2-input" placeholder="Section Name">',
        confirmButtonText: 'Create',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        onOpen: function () {
          var dropZone = document.getElementById('dropZone');
          
          dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            dropZone.style.backgroundColor = 'lightgray';
          });
          
          dropZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            dropZone.style.backgroundColor = '';
          });
          
          dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            dropZone.style.backgroundColor = '';
            var files = e.dataTransfer.files;
            handleFiles(files);
          });
        },
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve([
              document.getElementById('sectionName').value,
              sectionImage
            ]);
          });
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          var sectionName = result.value[0];
          var sectionImage = result.value[1];
          
          console.log(sectionName);
          console.log(sectionImage);
        }
      });
      
      function handleFiles(files) {
        var reader = new FileReader();
        reader.onload = function () {
          sectionImage = reader.result;
        };
        reader.readAsDataURL(files[0]);
      }
    };
  });
  
  