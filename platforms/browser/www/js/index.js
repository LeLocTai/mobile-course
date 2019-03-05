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

        $(document).on("pagecreate", "#form-page", function () {
            formController.initialize();
        });

        $(document).on("pagecontainerbeforeshow", function (event, ui) {
            if (ui.toPage[0].id === app.mainPage[0].id)
                app.updateStorageList();
        });
    },

    onDeviceReady: function () {
        dbmanager.initialize();
        app.updateStorageList();
    },

    updateStorageList: async function () {
        this.storageListView.empty();

        let storageList = await dbmanager.getAllStorages();

        for (let storage of storageList) {
            let listItem = $(this.getStorageListItem(
                storage
            ));
            this.storageListView.append(listItem);
        }

        this.storageListView.listview('refresh');
        console.log('List updated');
    },

    getStorageListItem: function (storage) {
        return `
<li>
    <a href="data-entry.html">
        <h2>${storage.storageType} Storage</h2>
        <div><h2>${storage.rentPrice}</h2> <small>$/month</small></div>
        <h2>${storage.size}</h2> <small>m²</small>
             
        ${storage.notes ? `<p>${storage.notes}</p>` : ''}
        
        <section class="ui-li-aside">
            <p><small>${storage.id}</small></p>
            <p><small>by</small> ${storage.reporterName}</p>
        </section>
    </a>
</li>
`;
    }
};

app.initialize();

