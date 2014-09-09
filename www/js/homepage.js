$(document).ready(function(){

	var winHeight=$(window).height();
	var headheight=$('header').outerHeight();
	var x = winHeight-4*headheight;

	$('.main-data').css({"height":x});

    $("#btn-qr-code").on('touchstart',function(){
        clickScan();
    });
    
    $("#btn-check-in").on('touchstart',function(){
	//	$('.attending').removeClass('hide');
    //    $('.attending .content').addClass('animated zoomIn');
        LocationServe();
    });
    
    $("#btnSignOut").on("touchstart",function(e){signOut();});    
      
   document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
});
