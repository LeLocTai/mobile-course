const formController = {
    form: null,
    
    initialize: function(){
        this.form = $('#form');
        
        this.form.submit(e => {
            e.preventDefault();

            let formData = formController.getNewFormObject();
            let rawData = formController.form.serializeArray();

            rawData.forEach(entry => {
                if (entry.value === 'on' && StorageFeature.hasOwnProperty(entry.name)) {
                    formData.features.push(StorageFeature[entry.name]);
                } else {
                    formData[entry.name] = entry.value;
                }
            });

            dbmanager.saveFormData(formData);
        });
    },
    
    getNewFormObject: function () {
        const formDataTemplate = {
            storageType: null,
            size: null,
            timeAdded: null,
            features: [],
            rentPrice: null,
            notes: null,
            reporterName: null
        };
        
        return Object.assign({}, formDataTemplate);
    } 
};