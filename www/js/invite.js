
$(document).ready(function(){
		inv.attachEvents();	
		//document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);	
});

var inv={

attachEvents:function(){ 
    $(".in-login-fb").on('click touchstart',function(){
        window.location.href = "https://www.facebook.com/TapAndEat"; 
    })
    
    $(".in-login-tw").on('click touchstart',function(){
        window.location.href = "https://twitter.com/TapAndEat_Tweet"; 
    })
    
    $(".in-login-gp").on('click touchstart',function(){
        window.location.href = "https://plus.google.com/u/0/113322841788809773774/posts"; 
    })
    
    $(".in-login-ins").on('click touchstart',function(){
        window.location.href = "http://instagram.com/tapandeat"; 
    })
    
    $(".in-login-em").on('click touchstart',function(){
        window.location.href = "http://mail.google.com"; 
    })

},


};

