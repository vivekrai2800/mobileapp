var accountPage = {
    init:function(){
        this.attachEvents();
        this.loadDataFormLocalStorage();
    },
    attachEvents:function(){
	
        $('#btnto-home').on('touchstart',function(){window.location.href="homepage.html";});
		
		$('#btnto-menu').on('touchstart',function(){window.location.href="menupage.html";});

		$(document).on('click touchstart','.email-edit',function(){
			$('#email-id').prop('readonly',false);
			$('#email-id').removeClass('ui-disabled');
			$('.email-det img').toggleClass('hide');
		});

		$(document).on('click touchstart','.pwd-edit',function(){
			$('#account-pwd').prop('readonly',false);
			$('#account-pwd').removeClass('ui-disabled');
			$('#account-pwd-new').removeClass('ui-disabled');
			$('#account-pwd-Confirm').removeClass('ui-disabled');
			$('.pwd-det img').toggleClass('hide');
			$('.details .change-pwd').removeClass('hide');
		});

		$(document).on('click touchstart','.phone-edit',function(){
			$('#phone-no').prop('readonly',false);
			$('#phone-no').removeClass('ui-disabled');
			$('.phone-det img').toggleClass('hide');
		}); 

		$('#email_save').on('click touchstart',function(){
			
			accountPage.updateAccountSettings();		
		});
		
		$('#password_save').on('click touchstart',function(){
			
			accountPage.updateAccountSettings();		
		});
		
		$('#phone_save').on('click touchstart',function(){
			
			accountPage.updateAccountSettings();		
		});
		
		$('#phone_save').on('click touchstart',function(){
			
			accountPage.updateAccountSettings();		
		});
		
    },
	loadDataFormLocalStorage:function(){
	
	 $('#email-id').val(localStorage.getItem('email'));
	 
	 $('#phone-no').val(localStorage.getItem('phoneNumber'));
	 
	},
	
    updateAccountSettings: function() {
	  	// get the form data
		var formData = {
			phoneNumber 		: $('input[name=number]').val(),
			oldPassword 		: $('input[name=oldPassword]').val(),
			resetPassword 	    : $('input[name=newPassword]').val(),
			email				: $('input[name=email]').val(),
			confirmPassword		: $('input[name=confirmPassword]').val(),
			customerId			: localStorage.getItem('customerId'),
		};	
	    $.ajax({
            url : 'http://localhost:9000/updateAccountSettings',
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
            	 case 'emailUpdated':
					   localStorage.setItem('email',formData.email);
					// Email Verification template page.
            	 	    return true;
            	 case 'numberUpdated':
						localStorage.setItem('phoneNumber',formData.phoneNumber);
						window.location.href="verification.html";
            	 		return true;
            	 case 'passwordUpdated':
						window.location.href="verification.html";
            	 		return true;
				}
           },
        });
    },
	
$(document).ready(function(){
    accountPage.init();
});






