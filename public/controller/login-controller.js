var login = angular.module('login', []);

login.controller('loginController', function($scope, $http) {


    $scope.register = function() {

        init($scope);
        var validated = true;

        if ($scope.first_name === undefined || $scope.first_name === '') {
            $scope.first_name_invalid = true;
            validated = false;
        }
        if ($scope.last_name === undefined || $scope.last_name === '') {
            $scope.last_name_invalid = true;
            validated = false;
        }
        if (!validateEmail($scope.email)) {
            $scope.email_invalid = true;
            validated = false;
        }
        if ($scope.reg_password === undefined || !validatePassword($scope.reg_password)) {
            console.log($scope.reg_password);
            $scope.password_invalid = true;
            validated = false;
        }

        if (validated) {
            $http({
                method: "POST",
                url: '/users/register',
                data: {
                    "FirstName": $scope.first_name,
                    "LastName": $scope.last_name,
                    "Email": $scope.email,
                    "Password": $scope.reg_password

                }
            }).success(function(data) {
                if (data.success == true) {
                    console.log("Signup true");
                    $scope.register_success = true;
                    // window.location.href='/';


                } else {
                    $scope.error_save = true;
                }

            }).error(function(error) {
                console.log(error);
                $scope.error_save = true;
            });
        }


    };

    $scope.login = function() {
        init($scope);
        var validated = true;
        if ($scope.login_password === undefined || $scope.login_password === '') {
            $scope.login_invalid = true;
            validated = false;
        }
        if (!validateEmail($scope.login_email)) {
            $scope.login_invalid = true;
            validated = false;
        }

        if (validated) {
            $http({
                method: "POST",
                url: '/users/login',
                data: {
                    "Email": $scope.login_email,
                    "Password": $scope.login_password
                }
            }).success(function(data) {
                if (data.success == true) {
                    console.log("Login true");
                    window.location.href = '/userAboutPage';

                } else {
                    $scope.login_invalid = true;
                    $scope.login_invalid_value = data.message;
                }

            }).error(function(error) {
                console.log(error);
                $scope.login_error = true;
            });
        }

    };


    $scope.updatePassword = function() {

        init($scope);
        var validated = true;

        if ($scope.old_password === undefined || !validatePassword($scope.old_password)) {
            $scope.old_password_invalid = true;
            validated = false;
        }
        if ($scope.new_password_1 === undefined || !validatePassword($scope.new_password_1)) {
            $scope.new_passworrd_1_invalid = true;
            validated = false;
        }

        if (validated) {
            $http({
                method: "POST",
                url: '/updatePassword',
                data: {

                    "old_password": $scope.old_password,
                    "new_password_1": $scope.new_password_1,
                    "new_password_2": $scope.new_password_2
                }
            }).success(function(data) {
                $scope.userName = data.userName;
                if (data.statusCode == 200) {
                    //password updated and refreshing the page
                    window.setTimeout(function(){
                    window.location.href = "/userAboutPage";
                }, 2500);
                    // res.redirect
                    $scope.save_password = true;
                } else if (data.statusCode == 201) {
                    $scope.not_match_password = true;
                } else if (data.statusCode == 202) {
                    $scope.old_password_wrong = true;
                } else {
                    $scope.error_password = true;
                }
                

            }).error(function(error) {
                console.log(error);
                
            });
        }
    };

    $scope.getProfileInfo = function() {
        console.log('Hello');

        $http({
            method: "POST",
            url: '/getInfo',
            data: {}
        }).success(function(data) {
            if (data.success) {

                $scope.f_name = data.user.FirstName;
                $scope.l_name = data.user.LastName;
                $scope.email = data.user.Email;

            } else {

            }

        }).error(function(error) {
            console.log(error);
        });
    };

    function init(scope) {

        scope.first_name_invalid = false;
        scope.last_name_invalid = false;
        scope.email_invalid = false;
        scope.password_invalid = false;
        scope.error_save = false;
        scope.password = false;
        scope.login_invalid = false;
        scope.login_error = false;
        $scope.login_invalid_value = '';
    }



    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function validatePassword(password) {
        var pwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return pwd.test(password);
    }



});