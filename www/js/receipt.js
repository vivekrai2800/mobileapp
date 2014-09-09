$(document).ready(function(){
    //document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    rec.attachEvents();
    var orderId = getUrlValue("orderId");
    rec.showDishData2(orderId);
});

var rec = {

    attachEvents:function(){
                
        $(".new-order").on('click touchend',function(){window.location.href="menupage.html";});
        
        $(".icon-fbb").on('click touchend',function(){
            window.location.href = "https://www.facebook.com/TapAndEat"; 
        });
        
        $("div.branding").on('touchend',function(){window.location.href="restinfo.html";});
        
        $(".icon-twb").on('click touchend',function(){
            window.location.href = "https://twitter.com/TapAndEat_Tweet"; 
        });
        
        $(".icon-gpb").on('click touchend',function(){
            window.location.href = "https://plus.google.com/u/0/113322841788809773774/posts"; 
        });
        
        $(".icon-insb").on('click touchend',function(){
            window.location.href = "http://instagram.com/tapandeat"; 
        });
        
        
        $('#btnReviewOrder').on('click touchend',function(){window.location.href="revieworder.html";});
        
        $(".to-home").on('click touchend',function(){
        window.location.href="homepage.html";
        });
        
        $(".to-menu").on('click touchend',function(){
        window.location.href="menupage.html";
        });
        
    },
        
    showDishData2:function(orderId){
        console.log("showing the dish data");
        var url='http://tapandeat.com:9000/getOrder?orderId=' + orderId;
                $.ajax({
                    url: url,
                    type:'GET',
                    success:function(response){
                        console.log("request successfully posted.");
                        rec.generateHtml(response);
                    },
                    error:function(response){
                        console.log("error in payment");
                    }
               });  
    },
    generateHtml:function(response) {
        // Get the order and order details.
        var order = response.order;
        var orderDetails = response.orderItems;
        
        // populate order id and other top row stuff
        $('#orderIdColumnId').html(order.orderId);
        $('#customerIdColumnId').html(order.customerId);
        $('#paymentStatusId').html(order.paymentStatus);
        
        // Iterate over order details and generate html
        var orderItem;
        var menuItem;
        var orderHTML;
        var itemPrice;
        var subTotal = 0;
        
        $.each(orderDetails, function (i, orderDetail) {
            orderItem = orderDetail.orderItem;
            menuItem = orderDetail.menuItem;
            itemPrice = parseFloat(menuItem.price)*orderItem.count;
            subTotal += itemPrice;
    
            // we print all amounts as 2 decimal fixed types.
            // TODO: Do the math on backend.
            // This is dangerous as floating point precision will screw us
            orderHTML += '<tr class="order-item">'+
                 '<td class="dish"><span>' + menuItem.itemName + '</span></td>'+
                 '<td class="count"><span>' + orderItem.count+'</span><span>x</span><i class="fa fa-inr"></i><span>' + parseFloat(menuItem.price).toFixed(2) + '</span></td>'+
                 '<td class="cost"><span><i class="fa fa-inr"></i>'+ itemPrice.toFixed(2) +'</span></td>'+
                 '</tr>';
        });
        
        // Set the items details and sub-total
        $('#orderItemTable').html(orderHTML);
        $('#subTotalId').html(subTotal.toFixed(2));
    
        // calculate some taxes and charges
        var serviceTax = (subTotal*12)/100;
        var serviceCharge =  (subTotal*2)/100;
        var vat =  (subTotal*2)/100;
        
        // set the taxes
        $('#serviceTaxId').html(serviceTax.toFixed(2));
        $('#serviceChargeId').html(serviceCharge.toFixed(2));
        $('#vatId').html(vat.toFixed(2));
        
        // set the total
        var total = subTotal + serviceTax + vat + serviceCharge;
        $('#totalId').html(total.toFixed(2));
    }
};
