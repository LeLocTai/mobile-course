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

    initialize() {
        this.db = this.openDb();
        this.prepareTables(this.db);
        this.fillData(this.db);
    },

    async saveFormData(formData) {
        return new Promise(resolve => {
            console.log(formData);
            this.db.transaction(async tx => {
                await saveStorageFields(tx);
                resolve();
            }, console.error);
        });

        async function saveStorageFields(tx) {
            return new Promise(resolve => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO ${Table.Storages} (StorageType_Name, "size", datetime_added, rent_price, notes, reporter_name) VALUES (?, ?, ?, ?, ?, ?)`
                    , [
                        formData.storageType,
                        formData.size,
                        formData.timeAdded,
                        formData.rentPrice,
                        formData.notes,
                        formData.reporterName
                    ], async (tx, rs) => {
                        await saveFeatures(tx, rs.insertId);
                        resolve();
                    }
                );
            })
        }

        async function saveFeatures(tx, storageId) {
            let promises = [];

            formData.features.forEach(featureName => {
                let promise = new Promise(resolve => {
                    tx.executeSql(
                        `INSERT INTO ${Table.Storage_StorageFeatures} (Storage_Id, StorageFeatures_Name) VALUES (?, ?)`
                        , [
                            storageId,
                            featureName
                        ], (tx, rs) => {
                            resolve();
                        }
                    );
                });
                promises.push(promise);
            });

            return Promise.all(promises);
        }
    },

    async getAllStorages() {
        return new Promise(resolve => {

            dbmanager.db.transaction(
                tx => tx.executeSql("SELECT * FROM " + Table.Storages, [], async (tx, rs) => {
                    resolve(await extractData(tx, rs));
                }),
                console.error
            );

            async function extractData(tx, rs) {
                let storageList = [];

                for (let row of rs.rows) {
                    let storage = Object.assign({}, formDataTemplate);

                    storage.id = row['Id'];
                    storage.storageType = row['StorageType_Name'];
                    storage.timeAdded = row['datetime_added'];
                    storage.notes = row['notes'];
                    storage.rentPrice = row['rent_price'];
                    storage.reporterName = row['reporter_name'];
                    storage.size = row['size'];

                    storage.features = await getFeatures(tx, storage.id);

                    storageList.push(storage);
                }

                return storageList;
            }

            async function getFeatures(tx, id) {
                return new Promise(resolve => {
                    let features = [];
                    tx.executeSql(
                        `SELECT StorageFeatures_Name FROM ${Table.Storage_StorageFeatures} WHERE Storage_Id = ?`,
                        [id],
                        (tx, rs) => {
                            for (let row of rs.rows) {
                                features.push(row['StorageFeatures_Name'])
                            }
                            resolve(features);
                        }
                    )
                })
            }

        });
    },

    fillData(db) {
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

    openDb() {
        return window.openDatabase(
            "mystoragedb",
            "1.0",
            "My Storage DB",
            4 * 1024 * 1024
        );
    },

    prepareTables(db) {
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