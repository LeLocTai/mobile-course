const Table = {
    StorageTypes: "StorageTypes",
    Storages: "Storages",
    StorageFeatures: "StorageFeatures",
    Storage_StorageFeatures: "Storage_StorageFeatures",
};

const dbmanager = {
    db: null,

    initialize: function () {
        this.db = this.openDb();
        this.prepareTables(this.db);
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
        db.transaction(createTables, error => console.log(error));

        function createTables(tx) {
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.StorageTypes}
                           (
                             Id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             Name TEXT    NOT NULL
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.Storages}
                           (
                             Id             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             StorageType_Id INTEGER NOT NULL,
                             "size"         REAL    NOT NULL,
                             datetime_added TEXT    NOT NULL,
                             rent_price     REAL    NOT NULL,
                             notes          TEXT,
                             reporter_name  TEXT    NOT NULL,
                             FOREIGN KEY (StorageType_Id) REFERENCES ${Table.StorageTypes} (Id)
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.StorageFeatures}
                           (
                             Id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             Name TEXT    NOT NULL
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${Table.Storage_StorageFeatures}
                           (
                             Storage_Id        INTEGER NOT NULL,
                             StorageFeature_Id INTEGER NOT NULL,
                             PRIMARY KEY (Storage_Id,
                                          StorageFeature_Id),
                             FOREIGN KEY (Storage_Id) REFERENCES ${Table.Storages} (Id),
                             FOREIGN KEY (StorageFeature_Id) REFERENCES ${Table.StorageFeatures} (Id)
                           )`);
        }
    },
};