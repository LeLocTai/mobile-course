const Table = {
    StorageTypes: "StorageTypes",
    Storages: "Storages",
    StorageFeatures: "StorageFeatures",
    Storage_StorageFeatures: "Storage_StorageFeatures",
};

const StorageFeature = {
    PrivateSpace: 'Private Space',
    SharingSpace: 'Sharing Space',
    CCTV: 'CCTV'
};

const dbmanager = {
    db: null,

    initialize: function () {
        this.db = this.openDb();
        this.prepareTables(this.db);
        this.fillData(this.db);
    },

    saveFormData: function (formData) {
        console.log(formData);
        this.db.transaction(tx => {
            saveStorageFields(tx);
        }, console.error);

        function saveStorageFields(tx) {
            tx.executeSql(
                `INSERT INTO ${Table.Storages} (StorageType_Name, "size", datetime_added, rent_price, notes, reporter_name)
                     VALUES (?, ?, ?, ?, ?, ?)`
                , [
                    formData.storageType,
                    formData.size,
                    formData.timeAdded,
                    formData.rentPrice,
                    formData.notes,
                    formData.reporterName
                ], (tx, rs) => {
                    saveFeatures(tx, rs.insertId)
                }
            );
        }

        function saveFeatures(tx, storageId) {
            formData.features.forEach(featureName => {
                tx.executeSql(
                    `INSERT INTO ${Table.Storage_StorageFeatures} (Storage_Id, StorageFeatures_Name) VALUES (?, ?)`
                    , [
                        storageId,
                        featureName
                    ]
                );
            })
        }
    },
    
    getAllStorage: function(){
        this.db.transaction(tx => {
            
        }, console.error)
    },

    fillData: function (db) {
        db.transaction(tx => {
            tx.executeSql(`INSERT into ${Table.StorageTypes} values ('Home'),('Business')`);
            tx.executeSql(`INSERT into ${Table.StorageFeatures} values 
                                     ('${StorageFeature.PrivateSpace}'),
                                     ('${StorageFeature.SharingSpace}'),
                                     ('${StorageFeature.CCTV}')`);
        }, error => {
            if (error.code !== 6) //Constraint fail, probably due to repetition
                console.error(error)
        })
    },

    openDb: function () {
        return window.openDatabase(
            "mystoragedb",
            "1.0",
            "My Storage DB",
            4 * 1024 * 1024
        );
    },

    prepareTables: function (db) {
        db.transaction(createTables, console.error);

        function createTables(tx) {
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.StorageTypes}
                           (
                              Name TEXT NOT NULL,
                              PRIMARY KEY (Name)
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.Storages}
                           (
                             Id             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             StorageType_Name TEXT NOT NULL,
                             "size"         REAL    NOT NULL,
                             datetime_added TEXT    NOT NULL,
                             rent_price     REAL    NOT NULL,
                             notes          TEXT,
                             reporter_name  TEXT    NOT NULL,
                             FOREIGN KEY (StorageType_Name) REFERENCES ${Table.StorageTypes} (Name)
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.StorageFeatures}
                           (
                             Name TEXT    NOT NULL,
                             PRIMARY KEY (Name)
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.Storage_StorageFeatures}
                           (
                              Storage_Id           integer NOT NULL, 
                              StorageFeatures_Name text NOT NULL, 
                              PRIMARY KEY (Storage_Id, StorageFeatures_Name), 
                              FOREIGN KEY(Storage_Id) REFERENCES Storages(Id), 
                              FOREIGN KEY(StorageFeatures_Name) REFERENCES StorageFeatures(Name)
                           )`);
        }
    },
};