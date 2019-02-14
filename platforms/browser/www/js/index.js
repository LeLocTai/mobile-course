// language=SQLite
const sql_createTables = `
  CREATE TABLE Storages
  (
    Id             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    StorageType_Id INTEGER NOT NULL,
    "size"         REAL    NOT NULL,
    datetime_added TEXT    NOT NULL,
    rent_price     REAL    NOT NULL,
    notes          TEXT,
    reporter_name  TEXT    NOT NULL,
    FOREIGN KEY (StorageType_Id) REFERENCES StorageTypes (Id)
  );
`;

var app = {
    db: null,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        this.db = this.openDb();
        this.prepareTables(this.db);
    },

    openDb: function () {
        return window.openDatabase(
            "mystoragedb",
            "1.0",
            "Storages DB",
            4 * 1024 * 1024
        );
    },

    prepareTables: function (db) {
        db.transaction(
            execSql,
            error => console.log(error)
        );

        function execSql(tx) {
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS StorageTypes
                           (
                             Id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             Name TEXT    NOT NULL
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS Storages
                           (
                             Id             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             StorageType_Id INTEGER NOT NULL,
                             "size"         REAL    NOT NULL,
                             datetime_added TEXT    NOT NULL,
                             rent_price     REAL    NOT NULL,
                             notes          TEXT,
                             reporter_name  TEXT    NOT NULL,
                             FOREIGN KEY (StorageType_Id) REFERENCES StorageTypes (Id)
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS StorageFeatures
                           (
                             Id   INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                             Name TEXT    NOT NULL
                           )`);
            // language=SQLite
            tx.executeSql(`CREATE TABLE IF NOT EXISTS Storage_StorageFeatures
                           (
                             Storage_Id         INTEGER NOT NULL,
                             StorageFeatures_Id INTEGER NOT NULL,
                             PRIMARY KEY (Storage_Id,
                                          StorageFeatures_Id),
                             FOREIGN KEY (Storage_Id) REFERENCES Storages (Id),
                             FOREIGN KEY (StorageFeatures_Id) REFERENCES StorageFeatures (Id)
                           )`);
        }
    },
};

app.initialize();