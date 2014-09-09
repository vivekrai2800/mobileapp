  var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=yes,toolbar=no,closebuttoncaption=close');

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    alert("success");
                    deferred.resolve(data);
                }).fail(function(response) {
                    alert("failure");
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};


var login = {
  init:function(){

  },
  attachEvents:function(){
  
        $("#logingp").on('click touchstart',function(){
            login.googlePlusLogin();
        });
        
        $("#login").on('click touchstart',function(){
            login.appLogin();
        });
        
        $("#signUpUser").on('click touchstart',function(){
            login.signUp();
        });
        
        $("#verify_phone_number").on('click touchstart',function(){
            login.verifyUser();
        });

        $("#initiateForgotPassword").on('click touchstart',function(){
            login.initiateForgotPassword();
        });
        
        $("#set_forgot_password").on('click touchstart',function(){
            login.setForgotPassword();
        });

        $("#notnow").on('click touchstart',function(){
            login.notNowLogin();
        });
        
        $("#logout").on('click touchstart',function(){
            login.signOut();
        });
        
        $("#genrate_Verification_Code").on('click touchstart',function(){
            login.generateVerificationToken();
        });
  },
  notNowLogin:function(){
    localStorage.clear();
    location.replace("homepage.html");
  },
  googlePlusLogin:function(){
      googleapi.authorize({
          client_id: '426438036923-im6vq18jh05i0kqrkfqgftdqscs08qa4.apps.googleusercontent.com',
          client_secret: '44xHmhrZ_KAam6SPlgAluqVf',
          redirect_uri: 'http://localhost',
          scope: 'https://www.googleapis.com/auth/plus.login'
        }).done(function(data) {
           //googleapi.setToken(data);
           alert(data.access_token);
            localStorage.setItem("Access Token", data.access_token);
           localStorage.setItem("loggedin", "true");
            localStorage.setItem("loggedinType", "google");
            location.replace("homepage.html");
        
          //$loginStatus.html('Access Token: ' + data.access_token);
          //code for calling the APIs to store the data on the server
        }).fail(function(data) {
          alert(data.error);
        });
  },
   appLogin: function() {
          // get the form data
                var formData = {
                    phoneNumber         : $('#login_form >[name=phone]').val(),
                    passWord             : $('#login_form >[name=password]').val(),
                    provider             : 'TAP_AND_EAT',
                    role                 : 'B2C_CUSTOMER',
                };
        
        $.ajax({
            url : 'http://tapandeat.com:9000/login',
            type : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType : 'json',
            error : function() {
                console.log("Error in user authentication from the service.");
            },
            success : function(data) {
                 var status = data.status;
                 switch (status){
                 case 'loginSuccess':
                    localStorage.setItem('customerId',data.customerId);
                    location.replace("homepage.html");
                     return true;
                 case 'userDoesNotExist':alert(data.message);
                         return false;
                 case 'wrongProvider':alert(data.message);
                         return false;
                 case 'wrongRole':alert(data.message);
                          return false;
                 case 'createdUnverified':alert(data.message);
                     return false;
                 case 'passwordMismatch':alert(data.message);
                     return false;
            }
           },
        });
    },
  
  signUp: function() {
          // get the form data
        var formData = {
            name                : $('#signUp-form >[name=name]').val(),
            phoneNumber         : $('#signUp-form >[name=phone]').val(),
            email                 : $('#signUp-form >[name=email]').val(),
            passWord            : $('#signUp-form >[name=password]').val(),
            provider             : 'TAP_AND_EAT',
            role                 : 'B2C_CUSTOMER',
        };
        $.ajax({
            url : "http://tapandeat.com:9000/signUp",
            type : 'POST',
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType : 'json',          
            error : function(xhr, textStatus, errorThrown) {
                console.log("Error in user registration from the service."+errorThrown);
            },
            success : function(data) {
                 var status = data.status;
                 switch (status){
                 //TODO Yash: success message should be display is different color
                 case 'createdUnverified':alert(data.message);
                    if(localStorage != null){
                        localStorage.setItem('phoneNumber',formData.phoneNumber);
                        localStorage.setItem('customerId',data.customerId);
                        localStorage.setItem('email',formData.email);
                        localStorage.setItem('password',formData.password);
                    }
                    $('.welcome').removeClass('hide');
                    $('.welcome .content').addClass('animated zoomIn');         
                    location.replace("verification.html");                
                     return true;
                 case 'userExists':alert(data.message);
                     return false;
              }
            },
        });
    },
    
    verifyUser: function() {
        // get the form data
        var formData = {
            phoneNumber     : localStorage.getItem('phoneNumber'),
            token             : $('input[name=token]').val(),
        };
        $.ajax({
            url : "http://tapandeat.com:9000/verifyPhoneNumber",
            type : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType : 'json',
            error : function(xhr, textStatus, errorThrown) {
                console.log("Error in user verify email from the service."+errorThrown);
            },
            success : function(data) {
                 var status = data.status;
                 var msgDiv = $("#messages").html(""); 
                 switch (status){
                 //TODO Yash: success message should be display is different color
                 case 'userVerified':location.replace("homepage.html");
                      return true;
                 case 'tokenNoteFound':alert(data.message);
                       return false;
                 case 'emailMismatch':alert(data.message);
                       return false;
                 case 'numberMismatch':
                    return false;
                    
              }
            },
        });
    },
    
    setForgotPassword: function() {
        // get the form data
        var formData = {
             phoneNumber         : localStorage.getItem('phoneNumber'),
             token                 : $('input[name=token]').val(),
             passWord            : $('input[name=password]').val(),
        };
        alert(formData.token);
        alert(formData.passWord);
        $.ajax({
            url : "http://tapandeat.com:9000/forgotPassword",
            type : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType : 'json',
            error : function(xhr, textStatus, errorThrown) {
                console.log("Error in setting forgot password from the service."+errorThrown);
            },
            success : function(data) {
                 var status = data.status;
                 var msgDiv = $("#messages").html(""); 
                 switch (status){
                 //TODO Yash: success message should be display is different color
                 case 'success':alert(data.message);
                     location.replace("index.html");
                      return true;
                 case 'invalidToken':alert(data.message);
                       return false;
                 case 'expiredToken':alert(data.message);
                       return false;
              }
            },
        });
    },
    
    generateVerificationToken : function() {    
        // get the form data
        var formData = {
            "phoneNumber"     : localStorage.getItem('phoneNumber'),
        };    
        $.ajax({
            url : "http://tapandeat.com:9000/generateVerificationToken",
            type : 'GET',
            dataType : 'json',
            error : function(xhr, textStatus, errorThrown) {
                console.log("Error in setting forgot password from the service."+errorThrown);
            },
            success : function(data) {
                 var status = data.status;
                 var msgDiv = $("#messages").html(""); 
                 switch (status){
                 //TODO Yash: success message should be display in different color
                 case 'success':alert(data.message);
                      return true;
                 case 'userNotExist':alert(data.message); 
                       return false;
              }
            },
        });
    },
    
    initiateForgotPassword: function() {
          // get the form data
        var formData = {
            "phoneNumber"     : $('#forgot_password_form >[name=number]').val()
        };
        url = "http://tapandeat.com:9000/initiateForgotPassword"
        login.callAjax(url,formData);
    },
    
   callAjax : function(url,formData){
      $.ajax({
            url : url,
            type : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType : 'json',
            error : function(xhr, textStatus, errorThrown) {
                console.log("Error coming from service"+errorThrown);
            },
            success : function(data) {
                 var status = data.status;
                 switch (status){
                 case 'success':alert(data.message);                 
                    if(localStorage != null){
                        localStorage.setItem('phoneNumber',formData.phoneNumber);
                    }
                    location.replace("resetpassword.html");                
                     return true;
                 case 'userNotExist':alert(data.message);
                         return false;
                }
            },
        });
      }, 
};

    $(document).ready(function() {
      window.addEventListener("orientationchange", function() {
          window.plugins.orientationchanger.lockOrientation('portrait');
    });
    

    login.attachEvents();
    $("#btn-signup").on('click touchstart',function(){
      fetchLocation();
    });
});
    
  var loginButton = $('#btn-login-fb');
  
  if (typeof CDV === 'undefined') {
      console.log('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    }
    if (typeof FB === 'undefined') {
      console.log('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    }
 
  loginButton.on('click', function(e) {
    e.preventDefault();
    
    FB.init({
        appId: "251576201695814",
        nativeInterface: CDV.FB,
        useCachedDialogs: false
      });
      
    FB.login(function(response) {
      if (response.status === 'connected') {
        console.log('logged in');
        localStorage.setItem("loggedin", "true");
        localStorage.setItem("loggedinType", "facebook");
        location.replace("homepage.html");
      } else {
        console.log('not logged in');
      }
    },{ scope: "email" });
 
  });


    
