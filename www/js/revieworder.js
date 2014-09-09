var order = [];
var amt=0;
var serviceCharge;
var totalamt;

    $(':radio').mousedown(function(e){
    var $self = $(this);
        if( $self.is(':checked') ){
            var uncheck = function(){
            setTimeout(function(){$self.removeAttr('checked');},0);
        };
        var unbind = function(){
            $self.unbind('mouseup',up);
        };
    var up = function(){
        uncheck();
        unbind();
        };
    $self.bind('mouseup',up);
    $self.one('mouseout', unbind);
  }
});
var tipamt;
function abcd(){    
        var tipamt=0;
        var tipAmount = 0;
        $('#number').each(function () {
        
            tipAmount += parseFloat($(this).val()) || 0;
            
        });
        tipamt = parseInt(tipAmount);
        
        var serviceCharge=(12/100)*(parseInt(amt));
    $(".ServCharge").text(parseInt(serviceCharge));
    var totalamt = parseInt(amt) + parseInt(serviceCharge) +  parseInt(tipamt);
    
    $(".tot-amt").text(parseInt(totalamt));
    
}


var reviewOrder = {
init:function(){
    this.attachEvents();
    this.showDishData();
},
attachEvents:function(){
    //$(".btn-pay-now").on("click touchstart",function(e){reviewOrder.payNowAfterReview(e);});
    $(".to-menu").on("touchend",function(e){window.location.href="menupage.html";});
    $("#btn-reset-order").on("touchstart",function(e){reviewOrder.resetOrder();});
     $('#pay-waiter').on('click touchstart',function(){window.location.href="receipt.html";});
  
},
payNowAfterReview:function(e){
    //getting the order from the localstorage
        var orderObj = localStorage.getItem('order');
        if(orderObj!=null)
        {
            order = orderObj;
        }
        var orderItem = reviewOrder.createJSONData();
        console.log("orderItem : "+orderItem);
        var restaurantId = localStorage.getItem('restaurantId');
        var tableNum = localStorage.getItem('tableNumber');
        //creating the order
        var url='http://tapandeat.com:9000/createOrder';
        var data='{"customerId":123,"restaurantId":' + restaurantId + ',"tableNum":' + tableNum + ',"orderItems":' +orderItem+'}';
        console.log("data : "+data);

        $.ajax({
                    url: url,
                    type:'POST',
                    data:data,
                    dataType: 'json',
                    contentType:'application/json',
                    success:function(response){
                        console.log("request successfully posted.");
                        var res = JSON.stringify(response);
                        console.log("response from server : "+res);
                        localStorage.setItem("orderId",res.orderId);
                        //location.replace("payment.html");
                    },
                    error:function(response){
                        console.log("error in payment");
                        var res = JSON.stringify(response);
                        alert("response from server : "+res);
                    }
               });  



                e.preventDefault();
        /*localStorage.clear();*/
},
createJSONData:function(){
    var jsonData = [],orderString='';
    order = JSON.parse(order);
    $.each(order, function (k, item) 
        {
            var jsonObj = {"itemId":item.dishId,"count":item.count};
            jsonData.push(jsonObj);
        });
    orderString = JSON.stringify(jsonData);
    return orderString;
    /*console.log("orderString : "+orderString);*/
},
resetOrder:function(){
    $('.ro-main-content-dish-list').html('<li><section class="mb">No items selected.</section></li>');
    clearOrderDetails();
//    localStorage.removeItem('order');
//    localStorage.removeItem('totalCount');
    location.reload();
},
totalAmount:function(){
    var tipamt=0;
    var serviceCharge=(12/100)*(parseInt(amt));
    $(".ServCharge").text(parseInt(serviceCharge));
    $(".sale-tot").text(parseInt(serviceCharge));
    var totalamt = parseInt(amt) + parseInt(serviceCharge) +  parseInt(tipamt);
    
    $(".tot-amt").text(parseInt(totalamt));
    $(".order-tot").text(parseInt(totalamt));
    
},
showDishData:function(){
    console.log("showing the dish data");
    //getting the item from localStorage
    var orderObj = localStorage.getItem('order');

    var order = JSON.parse(orderObj);
    var orderHTML = '';

    totalCount = localStorage.getItem('totalCount');
      /*console.log("value of totalCount : "+totalCount);*/
    if(totalCount!=null){
          $('.icon-plate-text').text(totalCount);
    }
      
    else{
          $('.icon-plate-text').text(0);
    }     
    /*console.log('retrievedObject: ', orderObj);*/
     $.each(order, function (i, val) {
         orderHTML += '<li><section class="mb">'+    
                    '<div class="icons left menuButtons">'+
                    '<em class="minus-icon icon icon-minus" id="subDishNo' + ''+i+''+'"></em>'+
                    '<div class="count-div div-count"><span class="dish-count" id="dishCount' + ''+i+''+'">'+val.count+'</span></div>'+
                    '<em class="plus-icon icon icon-plus" data-dishId='+val.dishId+' id="addDishNo' + ''+i+''+'"></em>'+
                    '</div><div class="dish-details">'+
                    '<div class="dish-name" id="dishName' + ''+i+''+'">'+val.dishName+''+
                    '</div><div class="dish-price">Rs'+((parseInt(val.price))*(parseInt(val.count)))+'</div></div></section></li>';
                    amt= amt + (parseInt(val.price))*(parseInt(val.count));
                    
     });

     $('.ro-main-content-dish-list').empty();
     console.log(orderHTML);
     $('.ro-main-content-dish-list').html(orderHTML);
     reviewOrder.totalAmount();

     $('.sub-tot').text(parseInt(amt));
},

};


//payment

function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
    
//$('#sidebar').css({"height":mainHeight+7}); 

$(document).ready(function(){
    reviewOrder.init();
});
