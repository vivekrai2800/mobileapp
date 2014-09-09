var locationPage = {
    init:function(){       
        this.loadLocation();
    },
  
    loadLocation:function(){
        this.fetchLocation();
    },

    /*
     * Function handler called when the location fetching is successful
     */
    onLocationFetchSuccess:function(position) {
        var mapOptions = {
            center : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            zoom : 14
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);

        var url = "http://tapandeat.com:9000/getNearbyRestaurants?latitude="+position.coords.latitude+"&longitude="+position.coords.longitude+"&radiusMeters=1000000000"; //Reduce the radius to something reasonable(10 kms?) once we have a lot of restaurants.
        
        $.ajax({
                    url: url,
                    type:'GET',
                    dataType: 'json',
                       error: function (error) { 
                           console.log("Error in getting data from the service. url "+url);
                       },
                    success: function (data) {
                    $('.main-content-loader').addClass('hide');
                    var ulElement = $('#main-content-location-list')[0];
                    var locationHtml = "";
                    for(var i=0; i < data.length; i++) {
                            var curElement = data[i];
                            locationHtml += '<li><section class="mb">' +
                            '<div class="main-con-dish-list-left left">' +
                                '<div class="main-con-dish-img">' +
                                    '<img src="images/menu/sample-dish-image.png" alt="dish image" class="main-con-dish-image"/>' +
                                '</div>' +
                                '<div class="dish-details">' +
                                    '<div class="dish-name">' +
                                        curElement.restaurant.name +
                                        '<em class="icon icon-green"></em>' +
                                        '<em class="icon icon-yellow"></em>' +
                                        '<button id="btnCheckIn" class="btnCheckIn"><span class="chk" data-value=\"' + curElement.restaurant.restaurantId + '\">CHECK IN</span></button>' +
                                    '</div>' +
                                    '<div class="main-con-dish-price">' +
                                        '<div class="main-con-address">' +
                                        i +"" + ( i+5 )+ "" + (i+1) + ", " + " Market Road, Delhi" +
                                        '</div>' +
                                        '<div>' +
                                            '<div class="main-con-distance">' +
                                                    '<div>' +
                                                        '<em class="icon icon-location-pin"></em>' +
                                                        parseInt(curElement.distance,10) + " KM " + 
                                                    '</div>' +
                                                    '<div class="main-con-rating">' +
                                                        '<em class="icon icon-yellow-star"></em>' +
                                                        '<em class="icon icon-yellow-star"></em>' +
                                                        '<em class="icon icon-yellow-star"></em>' +
                                                        '<em class="icon icon-yellow-star"></em>' +
                                                        '<em class="icon icon-grey-star"></em>' +
                                                    '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</section></li>';
                         var myLatlng = new google.maps.LatLng(curElement.referenceLocation.latitude,curElement.referenceLocation.longitude);
                         var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                                title: curElement.restaurant.name
                         });

                    } // FOR
                    ulElement.innerHTML = ulElement.innerHTML + locationHtml;
                    
                    // Add event handler so that when the button is clicked, appropriate restaurantId is stored in localStorage.
                    // We cannot add it earlier than this since we are adding it to generated html.
                    // Also clear the order from localStorage just in case we have it there from an earlier order
                    $(".chk").on('click touchstart',function(e){
                        clearOrderDetails();
                        //window.localStorage.removeItem('order');
                        //window.localStorage.removeItem('totalCount');
                        window.localStorage.setItem('restaurantId', e.target.getAttribute('data-value'));
                        window.location.href="menupage.html";
                    });
                  }
        });
    },

    /*
     * Function called when the location fetching fails
     */
    onLocationFetchError:function(error) {
        console.log('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n');
    },

    /*
     * Function to fetch the current location
     */
    fetchLocation:function() {
        navigator.geolocation.getCurrentPosition(this.onLocationFetchSuccess, this.onLocationFetchError, {timeout: 20000, enableHighAccuracy: true});
    }
};


$(document).ready(function(){
    //document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    locationPage.init();
});

