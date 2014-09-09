var order = [];
var amt=0;
var serviceCharge;
var totalamt;
var serTax;
var vat;
var vat_alcohol=0;


var reviewOrder = {
init:function(){
	this.showDishData();
    this.attachEvents();    
},
attachEvents:function(){   
    //$(".btn-pay-now").on("click touchstart",function(e){reviewOrder.payNowAfterReview(e);});  
  //  $("#btn-reset-order").on("touchstart",function(e){reviewOrder.resetOrder();});
    $('#pay-waiter').on('touchend',function(){reviewOrder.processOrder(false)});
    $('.remove-order').on('touchend',function(){
                clearOrderDetails();           
                location.reload();
                $(".ServCharge").text(parseInt(serviceCharge));
                $(".tot-amt").text(parseInt(totalamt));
                reviewOrder.resetOrder();
    });
    $('.addmore-btn').on('touchend',function(){window.location.href="menupage.html";});
	$('.removeDish').on('click touchstart',function(e){reviewOrder.DeleteItem(e);});
},
processOrder:function(payNow){
        //getting the order from the localstorage
        var orderObj = localStorage.getItem('order');
        if(orderObj!=null)
        {
            order = orderObj;
        }
        var orderItem = reviewOrder.createJSONData();
        console.log("orderItem : "+orderItem);
        
        // should come from checkin page, once it starts fetching real restaurants.
        var restaurantId = localStorage.getItem('restaurantId');
        
        var customerIdString = localStorage.getItem('customerId');
        if(customerIdString == null) {
            alert("You need to have signed up and logged in to access this feature!");
            location.replace("index.html#form-login");
            return;
        }
        
        // should come from login
        var customerId = parseInt(customerIdString);
        
        // should come from QR code
        var tableNum = 2; //localStorage.getItem('tableNumber');
        
        // UI has to specify it
        var orderType = "SITDOWN"; //localStorage.getItem('orderType');
        
        //creating the order
        var url='http://tapandeat.com:9000/createOrder';
        var data = {} ;
        data.customerId = customerId;
        data.restaurantId = parseInt(restaurantId);
        data.tableNum = tableNum;
        data.orderItems = orderItem;
        data.orderType = orderType;
        
        console.log("data : "+data);

        $.ajax({
                    url: url,
                    type:'POST',
                    data:JSON.stringify(data),
                    dataType: 'json',
                    contentType:'application/json',
                    success:function(response){
                        console.log("request successfully posted.");
                        var res = JSON.stringify(response);
                        console.log("response from server : "+res);
                        localStorage.setItem("orderId",response.orderId);
                        if(!payNow) {
                            reviewOrder.completeOrder();
                        }
                        //location.replace("payment.html");
                    },
                    error:function(response){
                        console.log("error in payment");
                        var res = JSON.stringify(response);
                        alert(res);
                    }
               });  
               // e.preventDefault();
        /*localStorage.clear();*/
},
completeOrder:function() {
	var url='http://tapandeat.com:9000/completeOrder';
    var data = {} ;
    data.orderId = parseInt(localStorage.getItem("orderId"));
    data.paymentStatus = "PAYTOWAITER";
    data.totalAmount =  localStorage.getItem('totalAmount');

    console.log("data : "+data);

    $.ajax({
                url: url,
                type:'POST',
                data:JSON.stringify(data),
                dataType: 'json',
                contentType:'application/json',
                success:function(response){
                    console.log("request successfully posted.");
                    clearOrderDetails(); // Clear the localStorage off order details. We have persisted it.
                    location.replace("receipt.html?orderId=" + data.orderId);
                },
                error:function(response){
                    console.log("error in payment");
                    if(response.status == 403) {
                        alert("You need to have signed up and logged in to place orders!");
                        location.replace("index.html#form-login");
                    } else {
                        alert(res);
                    }
                }
           });  

},
createJSONData:function(){
    var jsonData = [],orderString='';
    order = JSON.parse(order);
    $.each(order, function (k, item) 
        {
            var jsonObj = {"itemId":item.dishId,"count":item.count, "price":parseFloat(item.price.trim()).toFixed(2)};// make price 2 digit decimal
            jsonData.push(jsonObj);
        });
    //orderString = JSON.stringify(jsonData);
    return jsonData;
    /*console.log("orderString : "+orderString);*/
},
resetOrder:function(){
    $('.order-collection').html('<span>No items selected.</span>');  
},


totalAmount:function(subTotal){    
    // calculate some taxes and charges
    var serviceTax = (subTotal*4)/100;
    var serviceCharge =  (subTotal*5)/100;
    var vat =  (subTotal*12)/100;
    
    $("#serviceChargeId").text(serviceCharge);
    $("#serviceTaxId").text(serviceTax);
    $('#subTotalId').text(subTotal);
    $('#vatId').text(vat);
    
    $(".sale-tot").text(serviceCharge);
    var totalamt = serviceTax + serviceCharge + vat + subTotal;    
    $(".tot-amt").text(totalamt);
    $(".order-tot").text(totalamt);    
    localStorage.setItem('totalAmount',totalamt);
},
showDishData:function(){
    console.log("showing the dish data");
    //getting the item from localStorage
    var orderObj = localStorage.getItem('order');
    amt=0;
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
     
           orderHTML += '<tr class="order-item">'+
			    '<td class="minus"><em class="icon icon-minus" id="subDishNo' + ''+i+''+'"></em></td>'+
			    '<td class="count"><span class="dish-count" id="dishCount' + ''+i+''+'">'+val.count+'</span></td>'+
			    '<td class="plus"><em class="icon icon-plus" data-dishId='+val.dishId+' id="addDishNo' + ''+i+''+'"></em></td>'+
			    '<td class="dish"><span class="dish-name" id="dishName' + ''+i+''+'">'+val.dishName+''+'</span></td>'+
			    '<td class="cost"><span class="dish-price"><i class="fa fa-inr"></i>'+((parseInt(val.price))*(parseInt(val.count)))+'</span></td>'+
			    '<td class="remove"><span><i class="fa fa-trash-o removeDish" data-dishId='+val.dishId+' id="removeDish' + ''+i+''+'"></i></span></td>'+
				'</tr>';
                amt = amt + (parseInt(val.price))*(parseInt(val.count));                                                                
     });

     $('.ro-main-content-dish-list').empty();
     console.log(orderHTML);
     $('.ro-main-content-dish-list').html(orderHTML);
     reviewOrder.totalAmount(amt);

          $('.sub-tot').text(parseInt(amt));
},

DeleteItem:function(e){
var idValue = '';
idValue = $(e.currentTarget).attr('id');
idValue = idValue.replace("removeDish", "");
var itemId = $("#removeDish" + idValue).attr('data-dishId');

for(i=0;i<order.length;i++)
			{
				if(order[i].dishId==itemId)
				{
					totalCount = totalCount - order[i].count;
					order.splice(i,1);
					
				}
			}
		
			menupage.saveLocalStorage();
			e.preventDefault();
			reviewOrder.showDishData();
			this.attachEvents();
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
