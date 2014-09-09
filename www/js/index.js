jQuery.validator.addMethod("lettersonly", function(value, element) { 
        return this.optional(element) || /^[a-z]+$/i.test(value); 
}, "Letters only please");

$(document).ready(function(){
    
$( "#signUp-form" ).validate({ 
    errorElement: "p",
    rules: { 
        name: { 
        required: true, 
        lettersonly: true 
        }, 
        phone:{
         required: true,        
         minlength:10
        },
        confirm:{
         equalTo: "#password"            
        }
        }, 
        messages: { 
        name: "Please use aplhabets only", 
        phone:"Please enter minimum 10 digits"
        } 
});  
   
$('.signup-sel').on('click touchstart', function(event){   
    if ($("#signUp-form").valid() && $('#checkbox-1').attr('checked')) {
//      $("#signUp-form").submit();      
        $('.check-label').css('color','#fff');
        $('.verification').removeClass('hide');
        $('.verification .content').addClass('animated zoomIn');
    }else if($('#checkbox-1').not('checked')){       
       $('.ui-checkbox-on .ui-icon').css('border','1px solid red');
    }
});


$('.verification .content .edit,.verification .content .ok').on('click touchstart', function(event){       
    $('.verification').addClass('hide');
    $('.verification .content').removeClass('animated zoomIn');          
});

$('.welcome-msg').on('click touchstart', function(event){       
   // $('.welcome').removeClass('hide');
   // $('.welcome .content').addClass('animated zoomIn');          
});


$('.welcome .content .actions .order').on('click touchstart', function(event){       
    $('.welcome').addClass('hide');
    $('.welcome .content').removeClass('animated zoomIn');          
});

});


$(document).ready(function(){
	document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
});

$(document).bind("mobileinit", function(){
var hoverDelay = $.mobile.buttonMarkup.hoverDelay = 0;
$.mobile.defaultPageTransition = 'none';
$.mobile.defaultDialogTransition = 'slide';
$.mobile.pageContainer = $('#container');
});

$(document).on('swipeleft', '#firstpage,#howto1,#howto2,#howto3', function(event){    
    if(event.handled !== true) // This will prevent event triggering more then once
    {    
        var nextpage = $.mobile.activePage.next('[data-role="page"]');
        // swipe using id of next page if exists
        if (nextpage.length > 0 && nextpage.attr("id")!=="form-login") {
            $.mobile.changePage(nextpage, {transition: "slide", reverse: false}, true, true);
        }
        event.handled = true;
    }
    return false;         
});

$(document).on('swiperight', '#howto4,#howto3,#howto2,#howto1', function(event){     
    if(event.handled !== true) // This will prevent event triggering more then once
    {      
        var prevpage = $(this).prev('[data-role="page"]');
        if (prevpage.length > 0) {
            $.mobile.changePage(prevpage, {transition: "slide", reverse: true}, true, true);
        }
        event.handled = true;
    }
    return false;            
});

	$(document).on('pageinit',"#signup",function(){$('span.ui-icon').addClass('ui-icon-alt');});  
	$(document).on('pageinit',"#form-login",function(){ $('#sign').on('click touchstart',function(){$.mobile.changePage("#signup",{transition:"slideup",reverse:false},true,true);});});	
	$(document).on('pageinit',"#signup",function(){ $('#close').on('click touchstart',function(){$.mobile.changePage("#form-login",{transition:"slidedown"});});});
	$(document).on('pageinit',"#signup",function(){ $('#to-login').on('click touchstart',function(){$.mobile.changePage("#form-login",{transition:"slidedown"});});});
	$(document).on('pageinit',"#form-login",function(){ $('#forgot').on('click touchstart',function(){$.mobile.changePage("#forgotPassword",{transition:"slidedown"});});});
	$(document).on('pageinit',"#signup",function(){ $('.termsandcons').on('click touchstart',function(){window.location.href="terms.html";})});
	setTimeout(function(){ $.mobile.changePage("#firstpage");$(".ui-mobile-viewport").css({"background":"url('images/signup-bg.png')"});},3000);

	$(document).on('pageinit',"#home",function(){
		setTimeout(function(){ $.mobile.changePage("#firstpage");$(".ui-mobile-viewport").css({"background":"url('images/signup-bg.png')"});},3000);
	});
	

