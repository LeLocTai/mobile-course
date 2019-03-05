const app = {
    mainPage: null,
    storageListView: null,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        $(document).on("mobileinit", function () {
            $.mobile.defaultPageTransition = "slide";
            $.mobile.phonegapNavigationEnabled = true;
        });

        $(document).on("pagecreate", "#main-page", function () {
            app.mainPage = $('#main-page');
            app.storageListView = $('#storage-list');
        });
        
        $(document).on("pagecontainerbeforeshow", function (event, ui) {
            if (ui.toPage[0].id === app.mainPage[0].id) 
                app.updateStorageList();
        });
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
        <h2>${size} m²</h2>        
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

app.initialize();

