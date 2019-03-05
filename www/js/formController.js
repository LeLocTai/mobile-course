const formDataTemplate = {
    storageType: null,
    size: null,
    timeAdded: null,
    features: [],
    rentPrice: null,
    notes: null,
    reporterName: null
};
Object.freeze(formDataTemplate);

const formController = {
    form: null,

    initialize: function () {
        this.form = $('#form');

        this.form.submit(async e => {
            e.preventDefault();

            let formData = Object.assign({}, formDataTemplate);
            let rawData = formController.form.serializeArray();

            rawData.forEach(entry => {
                if (entry.value === 'on' && StorageFeature.hasOwnProperty(entry.name)) {
                    formData.features.push(StorageFeature[entry.name]);
                } else {
                    formData[entry.name] = entry.value;
                }
            });

            await dbmanager.saveFormData(formData);

            $.mobile.back();
        });
    }
};