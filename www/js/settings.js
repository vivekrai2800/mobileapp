$(document).ready(function(){
//document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
	set.attachEvents();
		
});

var winheight = $(window).height()-$("header").outerHeight();

var equalpad = winheight/4;
$('.left-circle').css({"height":equalpad});
//$('.left-circle').css({"margin-bottom":equalpad});
$('.right-circle').css({"height":equalpad});
//$('.right-circle').css({"margin-bottom":equalpad});
 var set = {


attachEvents:function(){

$(".cust-care .icon-circle").on('touchstart',function(){
window.location.href="mailto:feedback@tapandeat.com?subject=feedback";
});

$(".about-us .icon-circle").on('touchstart',function(){
window.location.href="about.html";
});

$(".feed .icon-circle").on('touchstart',function(){
window.location.href="mailto:feedback@tapandeat.com?subject=feedback";
});

$(".termsandcon .icon-circle").on('touchstart',function(){
window.location.href="terms.html";
});

$(".faq-option .icon-circle").on('touchstart',function(){
window.location.href="faq.html";
});

$(".privacy-policy .icon-circle").on('touchstart',function(){
window.location.href="privacy.html";
});

$(".how-to-tap .icon-circle").on('click touchstart',function(){
window.location.href="index.html#firstpage";
});

},


};

