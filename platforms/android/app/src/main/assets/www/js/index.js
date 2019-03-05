const app = {
    storageListView: null,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        dbmanager.initialize();
    },

    updateStorageList: function () {
        this.storageListView.empty();

        this.storageListView.append($(this.getStorageListItem(
            null,
            null,
            null,
            null,
            null,
            null
        )));

        this.storageListView.listview('refresh');
        console.log('List updated');
    },

    getStorageListItem: function (id, type, size, price, note, reporterName) {
        return `
<li>
    <a href="data-entry.html">
        <p><small>${id}</small></p>
        <h2>$${price}/month</h2>
        <p>${size} m²</p>        
        ${note ? `<p>${note}</p>` : ''}
        <section class="ui-li-aside">
            <h2>${type}</h2>
            <p>by ${reporterName}</p>
        </section>
    </a>
</li>
`;
    }
};

$(document).on("mobileinit", function () {
    $.mobile.defaultPageTransition = "slide";
    $.mobile.phonegapNavigationEnabled = true;
});

$(document).on( "pagecreate", function() {
    app.storageListView = $('#storage-list');
    app.updateStorageList();
});

app.initialize();

