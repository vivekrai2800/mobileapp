function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
	
$('#sidebar').css({"height":mainHeight+7});	
var payment= {

    init:function(){
        this.attachEvents();
        var orderId = localStorage.getItem("orderId");
        orderId = "1";
        console.log("setting the transNumber in the hidden field : "+orderId);
        $("#transNumber").text(orderId);
    },

    attachEvents:function(){
	
        $('#accordion').on('hidden.bs.collapse', toggleChevron);
        $('#accordion').on('shown.bs.collapse', toggleChevron);
      /*  
        $('#btn-go-back').on('click touchstart',function(e){
            location.replace("yourorder.html");
            e.preventDefault();
        });
*/
     //   $('#btn-payment-cancel').on('click touchstart',function(){payment.payCancel()});
        $('#btn-payment-pay-now').on('touchstart',function(event){
            if(event.type == "touchstart") {
                console.log('pay now events'); 
                payment.payNow();
            } else {
                payment.payNow();
                return false;
            }            
        });

       
       
      $("#btn-payment-cancel").on('click touchstart',function(){payment.payCancel()});
    },

    payCancel:function(){
        window.location.href="yourorder.html";
    },

    payNow:function() {
    	var merchantURLPart = "https://sandbox.citruspay.com/tapandeat";
        var hmac_signature = 'bf944a146e94503cbfe634179a77964419dd5406';//'568b457ac33b3f45e8cc5895700e8d6acd692045';
        var reqObj = new XMLHttpRequest();

        if(merchantURLPart.lastIndexOf("/") != -1){
            vanityURLPart= merchantURLPart.substring(merchantURLPart.lastIndexOf("/")+1)
        }

        // var paymentURL = 'https://sandbox.citruspay.com/tapandeat';
        // var paymentWindow = window.open(paymentURL, '_blank', 'location=yes');

        var orderAmount = "2";
        var merchantTxnId = "31";
        var currency = "INR";
        var ref = window.open('citrus.html', '_blank', 'location=yes');
        var scr = '$("#orderAmount").val("' + orderAmount + '");'
                  + '$("#merchantTxnId").val("' + merchantTxnId + '");'
                  + '$("#currency").val("' + currency + '");'
                  + '$("#secSignature").val("' + hmac_signature + '");'
                  + '$("#paymentMode").val("NET_BANKING");'
                  + 'document.paymentForm.action = "' + merchantURLPart + '";'
                  + 'document.paymentForm.method = \'POST\';'
                  + 'document.paymentForm.submit();';
        ref.addEventListener('loadstop', function (event) {
                                                        if(event.url.indexOf("citrus.html") >= 0) {
                                                            ref.executeScript({code:scr}, function() {});
                                                        } else if(event.url.indexOf("ResponseOfPayment") >= 0) {
                                                            ref.close();
                                                        }
                                                     });
        },
    
};

$(document).ready(function(){
	//document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    payment.init();
});
