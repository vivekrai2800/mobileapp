/**
 * Supports querying pending and completed orders for a customer.
 */
var orderHistory = {
    init:function() {
        orderHistory.attachEvents();
        orderHistory.listAllOrders(); // The defaul tab is list all orders
    },
    attachEvents:function(){
        // On clicking 'pending' tab, we load pending orders
        $('#pendingTabId').on('touchend', function() {orderHistory.listOrder(true, false)});
        
        // On clicking 'completed' tab, we load completed orders
        $('#completedTabId').on('touchend', function() {orderHistory.listOrder(false, false)});
        
        // This is to list all orders, when required
        $('#allOrderTabId').on('touchend', function() {orderHistory.listAllOrders()});
        
        // this is to highlight the tab that is clicked
        $('.history-container .navigation table tr td').on('touchend',function(){
            $('td.active').removeClass('active');
            $(this).addClass('active');
        });
    },
    
    /**
     * Lists orders for the customer and loads them on UI
     */
    listOrder:function(pending, append) {
        var url= "";
        var customerId = parseInt(localStorage.getItem('customerId'));

        if(pending) {
            url = 'http://tapandeat.com:9000/getCustomerPendingOrders?startTime=0&endTime=9999999999999&pageSize=10&customerId=' + customerId;
        } else {
            url = 'http://tapandeat.com:9000/getCustomerCompletedOrders?startTime=0&endTime=9999999999999&pageSize=10&customerId=' + customerId;
        }
        var orderHTML;
        $.ajax({
            url: url,
            type:'GET',
            success:function(response){
                console.log("request successfully posted.");
                var orderHTML = "";
                $.each(response, function(index, order) {
                    orderHTML += orderHistory.generateOrderListHTML(order);
                });
                if(append) {
                    $('#ordersListId').html($('#ordersListId').html() + orderHTML);
                } else {
                    $('#ordersListId').html(orderHTML);
                }
                
                $('.receipt-btn-empty').on('click touchend',function(e){
                    window.location.href="order_receipt.html?orderId=" + e.target.getAttribute('data-value');});
            },
            error:function(response){
                console.log("error in payment");
            }
       }); 
    },
    listAllOrders:function() {
        orderHistory.listOrder(true, false); // get pending order
        orderHistory.listOrder(false, true); // get completed order and append it
    },
    /**
     * Generates HTML of the order listing, using a given order object
     */
    generateOrderListHTML:function(order) {
        var date = new Date(order.orderDate);
        var orderHTML = '<div class="history-item">' + 
        '<table class="summary">' + 
            '<tr>' +                   
                '<td class="item one name" style="width:30%">' +
                    '<table>' + 
                        '<tr><td>Restaurant<td></tr>' +
                        '<tr><td class="bold">Woh Restaurant</td></tr>' +
                    '</table>' +
                '</td>' +                    
                '<td class="item payment-status one" style="width:30%">' +
                    '<table>' +
                        '<tr><td>Payment Status<td></tr>' +
                        '<tr><td class="bold">' + order.paymentStatus + '</td></tr>' +
                    '</table>' +
                '</td>' +
                '<td class="total one" style="width:30%">' +
                    '<table>' +
                        '<tr><td>Total<td></tr>' +
                        '<tr><td class="bold"><i class="fa fa-inr"></i><span>' + order.totalAmount + '</span></td></tr>' +
                    '</table>' +
                '</td>' +
            '</tr>' +
            '<tr>' +                                     
                '<td class="item order-status" style="width:30%">' +
                    '<table>' +
                        '<tr><td>Status: <span class="bold">' + order.orderState + '</span><td></tr>' +
                        '<tr><td>Id : <span class="bold">' + order.orderId + '</span></td></tr>' +
                    '</table>' +
                '</td>' +                 
                '<td class="item time" style="width:30%">' +
                    '<table>' +
                        '<tr><td>DATE: <span>' + this.getDateString(date) + '</span><td></tr>' +
                        '<tr><td>TIME: <span>' + this.getTimeString(date) + '</span></td></tr>' +
                    '</table>' +
                '</td>' +                                      
                '<td class="item receipt-btn">' +
                    '<button class="receipt-btn-empty" data-value="' + order.orderId + '">Receipt</button>' +
                '</td>' +             
            '</tr>' +            
        '</table>' +     
        '</div>';
        return orderHTML;
    },
    /**
     * Gets time in dd/mm/yyyy format
     */
    getDateString:function(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1; // zero based b.s.
        var year = date.getFullYear();
        return day + "/" + month + "/" + year;
    },
    /**
     * Gets time value in hh:mm AM/PM format
     */
    getTimeString:function(date) {
        var hour = date.getHours();
        var minute = date.getMinutes(); // zero based b.s.
        var amPM = "";
        if(hour < 12) {
            if(hour == 0) {
                hour = 12;
            }
            amPM = "AM";
        } else {
            if(hour != 12) {
                hour = hour - 12;
            }
            amPM = "PM";
        }
        return hour + ":" + minute + " " + amPM;
    }
};

// Enables all the js above 
$(document).ready(function(){
    orderHistory.init();
});