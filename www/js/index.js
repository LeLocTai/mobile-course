const app = {
    mainPage: null,
    storageListView: null,
    isDeviceReady: false,
    // Application Constructor
    initialize() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        $(document).on("mobileinit", () => {
            $.mobile.defaultPageTransition = "slide";
            $.mobile.phonegapNavigationEnabled = true;
        });

        $(document).on("pagecreate", "#main-page", () => {
            app.mainPage = $('#main-page');
            app.storageListView = $('#storage-list');
        });

        $(document).on("pagecontainerbeforeshow", (event, ui) => {
            if (app.isDeviceReady && ui.toPage[0].id === app.mainPage[0].id)
                app.updateStorageList();
        });
    },

    onDeviceReady() {
        dbmanager.initialize();
        formController.initialize();
        this.isDeviceReady = true;

        app.updateStorageList();


        $('#add-btn').click(e => {
            e.preventDefault();
            formController.start({});
        });

        let sliders = $('.filter-slider');
        // sliders.slider();
        sliders.on('input',e => app.onFilter);
    },

    onFilter(e) {
        let items = this.storageListView.children('.list-item');

        let priceMin = $('#price-range-min').val();
        let priceMax = $('#price-range-max').val();
        let sizeMin = $('#size-range-min').val();
        let sizeMax = $('#size-range-max').val();

        for (let i of items) {
            let item = $(i);
            let itemData = item.data();
            if (itemData.rentPrice >= priceMin &&
                itemData.rentPrice <= priceMax &&
                itemData.size >= sizeMin &&
                itemData.size <= sizeMax)
                item.show();
            else
                item.hide();
        }
    },

    async updateStorageList() {
        this.storageListView.empty();

        let storageList = await dbmanager.getAllStorages();

        for (let storage of storageList) {
            let listItem = $(this.getStorageListItem(storage));
            this.storageListView.append(listItem);
        }

        this.storageListView.listview('refresh');
        console.log('List updated');
    },

    getStorageListItem(storage) {
        let item = $(`
<li>
    <a href="">
        <h2>${storage.storageType} Storage</h2>
        <div><h2>${storage.rentPrice}</h2><small>$/month</small></div>
        <h2>${storage.size}</h2><small>m²</small>
             
        ${storage.notes ? `<p>${storage.notes}</p>` : ''}
        
        <section class="ui-li-aside">
            <p><small>${storage.id}</small></p>
            <p><small>by</small> ${storage.reporterName}</p>
        </section>
    </a>
</li>
`);
        item.addClass('list-item');
        item.data(storage);
        item.click(e => {
            formController.start(storage);
        });
        return item;
    }
};

app.initialize();

