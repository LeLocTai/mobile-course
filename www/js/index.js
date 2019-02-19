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
        db.transaction(handleTransaction, error => console.log(error));

        function handleTransaction(tx) {
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
                             StorageFeature_Id INTEGER NOT NULL,
                             PRIMARY KEY (Storage_Id,
                                          StorageFeature_Id),
                             FOREIGN KEY (Storage_Id) REFERENCES Storages (Id),
                             FOREIGN KEY (StorageFeature_Id) REFERENCES StorageFeatures (Id)
                           )`);
        }
    },
};
$( document ).on( "mobileinit", function() {	
	$.mobile.defaultPageTransition = "slide";
	$.mobile.phonegapNavigationEnabled = true;
});

app.initialize();