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

const form = $('#form');

form.submit(e => {
    e.preventDefault();
    let formData = Object.assign({}, formDataTemplate);
    let rawData = form.serializeArray();

    rawData.forEach(entry => {
        if (entry.value === 'on' && StorageFeature.hasOwnProperty(entry.name)) {
            formData.features.push(StorageFeature[entry.name]);
        } else {
            formData[entry.name] = entry.value;
        }
    });

    dbmanager.saveFormData(formData);
});