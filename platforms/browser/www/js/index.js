const app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        dbmanager.initialize();
    },
};

$(document).on("mobileinit", function () {
    $.mobile.defaultPageTransition = "slide";
    $.mobile.phonegapNavigationEnabled = true;
});

app.initialize();