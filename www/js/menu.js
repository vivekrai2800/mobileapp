/*jslint browser: true*/
/*global $, jQuery, console.log*/
var dishData = '', categorySelected = '', totalCount = 0, clearLocal = 0;itemflag = 0;
var order = [];
var number_of_categories = 8;
var number_of_visible_categories = 4;
var anime =$('ul.main-content-menu li').width()/number_of_categories;
//alert(anime);

var menupage = {
    init : function() {
    
        var orderObj = localStorage.getItem('order');
        if (orderObj != null) {
            order = JSON.parse(orderObj);
        }
        this.attachEvents();
        this.getDishData();
        this.menu_category();
    },
    attachEvents : function() {
        /* $("em[class*='icon-starter']").on("click",function(){console.log("here");}); */
		$('.rest-det').on('click touchstart',function(){window.location.href="restinfo.html"});
                
        $(document).on('touchstart', '.left-cat', function() {
            categoryNavigateleft();
        });
        
        $(document).on('touchstart','.right-cat',function() {
            categoryNavigateright();
        });
		
        $(".cart").on("click touchstart", function(e) {
            window.location.href="yourorder.html";
        });
        
        $(".main-content-menu li").on("touchstart", function(e) {
            menupage.selectMenuType(e);
        });
        
        $(".to-review").on("touchend", function(e) {
            menupage.reviewOrder();
        });
        
        $("#btnSignOut").on("touchstart", function(e) {
            signOut();
        });
        
        $("#btnAskWaiter").on("click touchstart", function(e) {
            menupage.askWaiter();
        }); 
        
        $(".attending .ok").on("click touchstart", function(e) {
            menupage.hidealert();
        }); 
    },
    resetOrder : function() {
        localStorage.removeItem('order');
    },
    attachEventsMenuItems : function() {
        $(".icon-minus").on("touchstart", function(e) {
            menupage.subtractDishNo(e);
        });
        $(".icon-plus").on("touchstart", function(e) {
            menupage.additionDishNo(e);
        });
        $(".main-content-dish-list li .dish-details").on("touchstart", function() {
            menupage.showDetailsDish();
        });
    },
    saveLocalStorage : function() {
        // converting this into a json array
        var jsonArray = JSON.stringify(order);
        console.log("Final jsonArray : " + jsonArray);
        localStorage.setItem('order', jsonArray);
        localStorage.setItem('totalCount', totalCount);
    },
    reviewOrder : function() {
        /* console.log("reviewOrder"); */
        menupage.saveLocalStorage();
        window.location.href="yourorder.html";
    },
    askWaiter : function() {    
        $('.attending').removeClass('hide');
        $('.attending .content').addClass('animated zoomIn');
        console.log("askWaiter");
    },
    hidealert : function() {    
        $('.attending').addClass('hide'); 
        $('.attending .content').removeClass('animated zoomIn');
    },

    hideNoDataCategories : function() {
        var cat = [ "starter", "dessert", "main", "drinks", "others" ];

        for ( var j = 0; j < cat.length; j++) {
            for ( var i = 0; i < dishData.length; i++) {
                if (dishData[i].Category.toUpperCase() === cat[j].toUpperCase()) {
                    var index = cat.indexOf(cat[j]);
                    cat.splice(index, 1);
                }
            }
        }

        for ( var i = 0; i < cat.length; i++) {
            console.log(cat[i].toLowerCase());
            var classname = "." + cat[i].toLowerCase();
            $(".main-content-menu " + classname + " ").hide();
        }
    },
    getDishData : function() {
        /*
         * var url
         * ="http://tapandeat.cloudapp.net/Service1.svc/Getmenudatajson";
         */
        var retaurantId = localStorage.getItem('restaurantId');
        var url = "http://tapandeat.com:9000/getMenu?restaurantId="
                + retaurantId;
        $.ajax({
            url : url,
            type : 'GET',
            dataType : 'json',
            error : function() {
                console.log("Error in getting data from the service.");
            },
            success : function(data) {
                $('.main-content-loader').addClass('hide');
                dishData = data;
                /* menupage.hideNoDataCategories(); */
                categorySelected = $(
                        '.main-content-menu .selected .main-con-menu-text')
                        .text();
                menupage.showDataByCategory(categorySelected);
            }
        });
    },
    showDataByCategory : function(category) {
        var foodItem = '', flag = 0, order = '', count = 0;

        // checking the objects saved in localstorage
        var orderObj = localStorage.getItem('order');
        if (orderObj != null) {
            order = JSON.parse(orderObj);
        }

        totalCount = localStorage.getItem('totalCount');
        /* console.log("value of totalCount : "+totalCount); */
        if (totalCount != null) {

            if (totalCount > 9) {
                $('.icon-plate-text').css({
                    "left" : "42%"
                });
            }
            $('.icon-plate-text').text(totalCount);

        } else {
            $('.icon-plate-text').text(0);
        }

        $.each(
                        dishData,
                        function(i, val) {
                            if (val.itemType.toUpperCase() == category
                                    .toUpperCase()) {
                                flag = 1; // category matched

                                if (order != null) {
                                    for ( var j = 0; j < order.length; j++) {
                                        if (order[j].dishId == val.itemId) {

                                            count = order[j].count;
                                            /*
                                             * console.log("count for displaying
                                             * in inner loop :
                                             * "+val.Name+count);
                                             */
                                            break;
                                        } else {
                                            /*
                                             * console.log("Setting count to
                                             * 0");
                                             */
                                            count = 0;
                                        }
                                    }
                                }

                                /*
                                 * console.log("Outside, while forming div: " +
                                 * count);
                                 */
                                var addId = '', subId = '', dishCountId = '';
                                var price = currency(val.price);
                                foodItem += '<li class="items"><section class="mb"><div class="menu-items"><div class="dish-name " id="dishName'
                                        + ''
                                        + i
                                        + ''
                                        + '">'
                                        + val.itemName
                                        + '</div><div class="rupie"><i class="fa fa-inr"></i><span class="main-con-dish-prices" id="dishPrice'
                                        + ''
                                        + i
                                        + ''
                                        + '"> '
                                        + price
                                        + '</span></div><span class="menuButtons"><ul><li><em class="icon icon-minus sub-icon" id="subDishNo'
                                        + ''
                                        + i
                                        + ''
                                        + '">' 
                                        + '</em></li><li><span class="dish-count count-no" id="dishCount'
                                        + ''
                                        + i
                                        + ''
                                        + '">'
                                        + count
                                        + '</span></li>'
                                        + '<li><em class="icon icon-plus add-icon" data-dishId='
                                        + val.itemId
                                        + ' id="addDishNo'
                                        + ''
                                        + i
                                        + ''
                                        + '"></em></em></li></ul></span>'
                                        + '</div></section></li>';
                                $('#main-content-dish-list').empty();
                                $('#main-content-dish-list').append(foodItem);
                            }
                        });

        if (flag === 0) {
            foodItem = '';
            foodItem += '<li><section class="mb">Sorry!No data available for this category. </section></li>';
            $('#main-content-dish-list').empty();
            $('#main-content-dish-list').append(foodItem);
        }

        menupage.attachEventsMenuItems();
    },
  
    selectMenuType : function(e) {
        $(".main-content-menu li").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        categorySelected = $(e.currentTarget).find('.main-con-menu-text')
                .text();
        menupage.showDataByCategory(categorySelected);
    },
    showDetailsDish : function() {
        console.log("Moving to the details page..");
    },
    subtractDishNo : function(e) {
        var idValue = '', curDishCount = '', curDishCountInt = 0, countId = '', dishName = '', dishNameId = '';
        idValue = $(e.currentTarget).attr('id');
        console.log("subtacting for id : " + idValue);
        idValue = idValue.replace("subDishNo", "");

        dishNameId = '#dishName' + idValue;
        dishName = $(dishNameId).text();
        countId = '#dishCount' + idValue;
        curDishCount = $(countId).text();
        var itemId = $("#addDishNo" + idValue).attr('data-dishId');
        /* console.log("itemId : "+itemId); */
        curDishCountInt = parseInt(curDishCount, 10);
        if (curDishCountInt !== 0) {
            curDishCountInt = curDishCountInt - 1;
			
	
			
            if (totalCount != 0) {
                --totalCount;
                if (totalCount < 10)
                    $('.icon-plate-text').css({
                        "left" : "48%"
                    });

                $('.icon-plate-text').text(totalCount);
            }

            $("#dishCount" + idValue).text(curDishCountInt);
            $.each(order,
                    function(k, item) {
                        if (item.dishName == dishName
                                && item.dishId == itemId) {

                            order[k]["count"] = curDishCountInt;
                            console.log("subtracting an item : " + itemId + ":"
                                    + order[k]["count"])
                        }
                    });
					
					
        }
		
			for(i=0;i<order.length;i++)
			{
				if(order[i].count==0)
				{
					order.splice(i,1);
					
				}
			}
             
		menupage.saveLocalStorage();
		e.preventDefault();
		reviewOrder.showDishData();
		menupage.attachEventsMenuItems();		
    },
	
    additionDishNo : function(e) {

        var idValue = '', curDishCount = '', curDishCountInt = 0, countId = '', dishName = '', dishNameId = '', dishPriceId = '', obj = {}, flag = 0, price = '';
        idValue = $(e.currentTarget).attr('id');
        console.log("adding for value : " + idValue);
        ++totalCount;
        if (totalCount > 9)
            $('.icon-plate-text').css({
                "left" : "42%"
            });
        $('.icon-plate-text').text(totalCount);

        idValue = idValue.replace("addDishNo", "");
        dishNameId = '#dishName' + idValue;
        dishPriceId = '#dishPrice' + idValue;
        price = $(dishPriceId).text();

        dishName = $(dishNameId).text();
        countId = '#dishCount' + idValue;

        curDishCount = $(countId).text();
        var itemId = $("#addDishNo" + idValue).attr('data-dishId');

        curDishCountInt = parseInt(curDishCount, 10);
        curDishCountInt += 1;
        $("#dishCount" + idValue).text(curDishCountInt);

        $.each(order, function(k, item) {
            /* console.log("categorySelected : "+categorySelected); */
            console.log("inside order :orderInput : " + item.category + ":"
                    + item.dishName);
            if (item.dishName == dishName && item.dishId == itemId) {
                /* item.count += 1; */
                item.count = curDishCountInt;
                itemflag = 1;
                console.log("adding an item : " + itemId + ":" + item.count);
            }
        });

        if (itemflag == 0) {
            /* console.log("pushing the category : "+categorySelected); */
            var jsObj = {
                "category" : categorySelected,
                "dishName" : dishName,
                "dishId" : parseInt(itemId, 10),
                "count" : 1,
                "price" : price
            };
            console.log("Pushing : " + JSON.stringify(jsObj));
            order.push(jsObj);
        }

       
        /* console.log("Final item count : "+order.length); */
		menupage.saveLocalStorage();
		e.preventDefault();
		reviewOrder.showDishData();
		menupage.attachEventsMenuItems();		      
    },
    
    menu_category:function(){            
        var winWidth = $(window).width()*(0.8);
        var left_margin = $(window).width()*0.1;
        $('.main-content-menu').css({"margin-left":left_margin});
        if(winWidth>600){number_of_visible_categories=5;};
        $('.main-content-menu').css({"width":winWidth});    
        $('.main-content-menu li').css({"width":(winWidth/number_of_visible_categories)-7.5});
    
    },
};

$(document).ready(function() {
    menupage.init();      
});
