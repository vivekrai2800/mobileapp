function redirectToHomeScreen() {
    window.location.replace("homeScreen.html");
    window.localStorage.setItem("loggedIn", "yes");
};

$(".btnCheckIn").on('click touchstart', function() {
    window.location.href="menupage.html";
});

function signOut() {
    console.log('signout clicked');
    FB.init({
        appId : "251576201695814",
        nativeInterface : CDV.FB,
        useCachedDialogs : false
    });

    FB.logout(function(response) {
        console.log('logged out');
    });

    location.replace("signup.html");
}

/*
 * Function to validate the QR code Here we will validate that the type is
 * QR_CODE and the url matches with the template we have finalized
 */
function validateQRCode(url, type) {
    var pattern = /^(http|https):\/\/tapandeat.com\/\d{4}\/\d{4}$/;
    return pattern.test(url) && type == "QR_CODE";
}

/* console.log for check in at Restaurant using Location service */
function LocationServe() {
    console.log("Location Services button is clicked");
    window.location.href="checkin.html";
}

/*
 * Function which is called once the user clicks on scan QR button
 */
function clickScan() {
    /* console.log("function called new"); */
    cordova.plugins.barcodeScanner.scan(function(result) {
        console.log("We got a barcode\n" + "Result: " + result.text + "\n"
                + "Format: " + result.format + "\n" + "Cancelled: "
                + result.cancelled);

        if (result.cancelled == false) {
            if (validateQRCode(result.text, result.format) == true) {
                window.localStorage.setItem("qr_code", result.text);
                var str = result.text.split('/');
                window.localStorage.setItem("restaurantId", str[3]);
                window.localStorage.setItem("tableNumber", str[4]);
                window.location.href="menupage.html";
            } else {
                alert("invalid QR code");
            }
        }
    }, function(error) {
        console.log("Scanning failed: " + error);
    });
}

function onDeviceReady() {
    // console.log("called");
    var output = window.localStorage.getItem("loggedIn");
    // console.log(output);

    if (output == "yes") {
        redirectToHomeScreen();
    } else {
        // console.log("set item");
        window.localStorage.setItem("key", "value");
        var keyname = window.localStorage.key(0);
        // console.log("get item");
        // keyname is now equal to "key"
        var value = window.localStorage.getItem("key");
        // console.log(value);
        // value is now equal to "value"
        window.localStorage.removeItem("key");
        window.localStorage.setItem("key2", "value2");
        window.localStorage.clear();
        // console.log("done");
    }
    
};

var app = {
    // Application Constructor
    initialize : function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents : function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady : function() {
        app.receivedEvent('deviceready');        
    },
    // Update DOM on a Received Event
    receivedEvent : function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function categoryNavigateleft(){        
        var pos = $('#main-cat-content').scrollLeft();        
        //alert(pos);
        $('ul.main-content-menu').animate({scrollLeft:pos-anime},100);              
};

function categoryNavigateright(){
        var pos = $('#main-cat-content').scrollLeft();        
        //alert(pos);
        $('ul.main-content-menu').animate({scrollLeft:pos+anime},100);
                   
};

function currency(n) {
    n = parseFloat(n);
    return isNaN(n) ? false : n.toFixed(0);
};
/**
 * Clear the order details from localStorage.
 * Call this to reset stale order details.
 */
function clearOrderDetails() {
    localStorage.removeItem('order');
    localStorage.removeItem('totalCount');    
};

function getUrlValue(varSearch){
    var searchString = window.location.search.substring(1);
    var variableArray = searchString.split('&');
    for(var i = 0; i < variableArray.length; i++){
        var keyValuePair = variableArray[i].split('=');
        if(keyValuePair[0] == varSearch){
            return keyValuePair[1];
        }
    }
};

/**
 * Uses platform support for implementing back button behavior.
 * The backbutton should have id 'backButton' to use this.
 * Calling init() on page load enables the class.
 */
var platformBackButton = {
        /**
         * To be called on page load/document.ready to enable this class.
         */
        init:function() {
            // Attach event handler
            this.attacheEventHandler();
        },
        attacheEventHandler:function() {
                $("#backButton").on("touchend", function() {
                    history.go(-1);
                });
        }
};

/**
 * Implements custom backbutton logic using local storage. 
 * The backbutton default logic may not work properly accross
 * different platforms. This can be used in such scenarios.
 * So we just have button that looks like
 * back button and event handlers that implement our own backbutton
 * logic. The backbutton should have id 'backButton' to use this.
 * Calling init() on page load enables the class.
 * 
 * It does not store more than a fixed size of history(50 pages when
 * this was written)
 *
 */
var backButtonLogic = {
        /**
         * To be called on page load/document.ready to enable this class.
         */
        init:function() {
            // Attach event handler
            this.attacheEventHandler();
            
            // Update the history with current page URL
            this.updateHistory();
        },
        attacheEventHandler:function() {
            if(this.isHistoryPresent()) { // only add if history present
                $("#backButton").on("touchend", this.backButtonHandler);
            }
        },
        /**
         * touchend handler for backbutton.
         */
        backButtonHandler:function(e) {
            // prevent any default logic
            e.preventDefault();
            
            // Get the page browsing history from local storage which is basically an array
            // of URLs in the order of browsing.
            var pageStack = JSON.parse(localStorage.getItem('pageHistoryStack'));
            
            if(!pageStack) { // unexpected. The button to be displayed only when there is history.
                return;
            }
            
            // First one must be the current page URL. Just pop it and set it back into localstorage.
            pageStack.pop();
            localStorage.setItem('pageHistoryStack', JSON.stringify(pageStack));

            // Navigate to the page on top of the stack. Mark it to be coming from back button
            location.replace(pageStack[pageStack.length - 1] + "?back=true");
        },
        isHistoryPresent:function() {
            var pageStack = JSON.parse(localStorage.getItem('pageHistoryStack'));
            if(pageStack) {
                return true; 
            } else {
                return false;
            }
        },
        /**
         * Updates the history of URL loading to help
         * the backbutton logic
         */
        updateHistory:function() {
            
            // Get the current URLs last part(relative URL).
            var href = window.location.href;
            var url = href.substr(href.lastIndexOf('/') + 1);
            
            // Clear the history on apps first screen.
            if(url == 'index.html') {
                localStorage.removeItem('pageHistoryStack');
            }
            
            // Get the page history stack from storage
            var pageHistoryStack = localStorage.getItem('pageHistoryStack');
            var pageStack;
            
            // If page history is not initialized, initialize it
            if(pageHistoryStack == null) {
                pageStack = [];
                localStorage.setItem('pageHistoryStack', JSON.stringify(pageStack));
            } else { // If already present, just get it
                pageStack = JSON.parse(localStorage.getItem('pageHistoryStack'));
            }

            // Check if we are on this page due to a back button click. If so,
            // Don't add this page to history. Else add it.
            var back = getUrlValue("back");
            if(!back) {
                pageStack.push(url);
                // if history is bigger than 50, lose the last
                if(pageStack.length > 50) {
                    pageStack.shift();
                }
                
                localStorage.setItem('pageHistoryStack', JSON.stringify(pageStack));
            }
        }

}
$(document).ready(function() {
    // Enable backbutton logic. Note that
    // the back button id should be what
    // the class expects it to be. Read
    // the class doc of platformBackButton
    // for usage.
    platformBackButton.init();
});
