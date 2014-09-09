//declaring variables for navigation design
var headHeight=$("header").outerHeight();
var footHeight=$("footer").outerHeight();
var screenHeight=$(window).height();
var mainHeight=screenHeight-(headHeight+footHeight);
var divHeight=mainHeight/6;
//alert(mainHeight);
//alert($("header").outerHeight());
//dynamically changing css for navigation
$('#sidebar').css({"top":headHeight});
$('#sidebar').css({"height":mainHeight});
$('#sidebar li').css({"height":divHeight});

//navigation functionality common to each page
function navigationBar(e) {
    /* console.log("navigation bar in corefunctions.js"); */
    $('header').toggleClass('active');
    
    if ($('header').hasClass('active')) {
        $('.header-data,.main-data,.footer-data').animate({
            'right' : '0%'
        }, 100);
        $('#sidebar').animate({
            'right' : '0px',                        
        }, 100);
        $("#sidebar").removeClass('hide');
    } else {
        $('.header-data,.main-data,.footer-data').animate({
            'right' : '0%'
        }, 100);
        $('#sidebar').animate({
            'right' : '-80px',
            
            
        }, 100);
        $("#sidebar").addClass('hide');
    }

    
}

function navigationBarHide() {
    $('.header-data,.main-data,.footer-data').animate({
        'right' : '0px'
    }, 100);
    $('#sidebar').animate({
        'right' : '-80px',
       
        
    }, 100);
    $('header').removeClass('active');
    $("#sidebar").addClass('hide');

}

$("main").on("touchstart",function(){ 
            if($('header').hasClass('active'))
              { 
                navigationBarHide();
              }
    });

$(".navigate").on("touchend",function(e){navigationBar(e);});

//navigation links for all pages

        $("#Invitepage").on('touchstart', function() {
            window.location.href = "invite.html"
        });
        
        $("#Homepage").on('touchstart', function() {
            window.location.href = "homepage.html"
        });

        $("#myOrderpage").on('touchstart', function() {
            window.location.href = "orderhistory.html"
        });

        $("#Settingspage").on('touchstart', function() {
            window.location.href = "settings.html"
        });
        
        $("#Accountpage").on('touchstart', function() {
            loadAccount();
        });
		
		$("#signoutlink").on('touchstart', function() {
            logout();
        });
        
function loadAccount() {		
	  	// get the form data
		var formData = {
			customerId 		: localStorage.getItem('customerId'),
		};
	    $.ajax({
            url : 'http://tapandeat.com:9000/getCustomerDetails',
            type : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType : 'json',
            error : function() {
                console.log("Error in user authentication from the service.");
            },
            success : function(data) {
            	 var status = data.status;
            	 if(data!=null){
					if(localStorage != null){
						localStorage.setItem('phoneNumber',data.phoneNumber);
						localStorage.setItem('email',data.email);
					}
					window.location.href="account.html";   	 
			 }else {
			 
				console.log('Getting data is null');
			 }
            	 
            },
    });
}

function logout() {

		$.ajax({
            url : "http://tapandeat.com:9000/logout",
            type : 'GET',
            dataType : 'json',
            error : function(xhr, textStatus, errorThrown) {
                console.log("Error in setting forgot password from the service."+errorThrown);
            },
            success : function(data) {
            	 var status = data.status;
            	 switch (status){
            	 //TODO Yash: success message should be display is different color
            	 case 'success':
					localStorage.clear();
            	 	window.location.href="index.html";
     	 			return true;
              }
            },
    });
}
        
