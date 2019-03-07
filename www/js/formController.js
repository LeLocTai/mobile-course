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

    async initialize() {
        $(document).on("pagecontainerbeforehide", (e, ui) => {
            if (ui.prevPage.prop('id') === "form-page")
                $(document).off("pagecreate", "#form-page");
        });
    },

    async onSubmit(e) {
        e.preventDefault();

        let formData = $.extend(true, {}, formDataTemplate);
        let rawData = formController.form.serializeArray();

        rawData.forEach(entry => {
            if (entry.value === 'on' && StorageFeature.hasOwnProperty(entry.name)) {
                formData.features.push(StorageFeature[entry.name]);
            } else {
                formData[entry.name] = entry.value;
            }
        });
        
        formData.id = e.data.id;
            
        await dbmanager.saveFormData(formData);

        $.mobile.back();
    },

    async start(formData) {
        $(document).on("pagecreate", "#form-page", () => {
            formController.form = $('#form');
            formController.form.submit(formData, formController.onSubmit);

            formController.fillFormWith(formData);
        });

        $.mobile.navigate('data-entry.html');
    },

    fillFormWith(formData) {
        for (let key in formData) {
            if (key === 'features') {
                formData.features.forEach(feature => {
                    let inputName = Object.keys(StorageFeature).filter(key => StorageFeature[key] === feature);
                    let input = findInputWithName(inputName);
                    input.prop('checked', true).checkboxradio('refresh');
                })
            } else {
                findInputWithName(key).val(formData[key]);
            }
        }

        function findInputWithName(name) {
            return formController.form.find(`:input[name="${name}"]`);
        }
    }
};