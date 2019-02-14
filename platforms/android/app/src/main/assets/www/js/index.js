const sql_createTables = `
  CREATE TABLE Storage_StorageFeatures
  (
    Storage_Id         INTEGER NOT NULL,
    StorageFeatures_Id INTEGER NOT NULL,
    PRIMARY KEY (Storage_Id,
                 StorageFeatures_Id),
    FOREIGN KEY (Storage_Id) REFERENCES Storages (Id),
    FOREIGN KEY (StorageFeatures_Id) REFERENCES StorageFeatures (Id)
  );
  CREATE TABLE StorageFeatures
  (
    Id   INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL
  );
  CREATE TABLE Storages
  (
    Id             INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    StorageType_Id INTEGER  NOT NULL,
    "size"         REAL     NOT NULL,
    datetime_added TEXT NOT NULL,
    rent_price     REAL     NOT NULL,
    notes          TEXT,
    reporter_name  TEXT NOT NULL,
    FOREIGN KEY (StorageType_Id) REFERENCES StorageTypes (Id)
  );
  CREATE TABLE StorageTypes
  (
    Id   INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL
  );
`;

var app = {
    db: null,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        function prepareDb() {
            this.db = window.openDatabase("mystoragedb", "1.0", "Storages DB", 2 * 1024 * 1024);

            this.db.transaction((tx) => {
                tx.executeSql(sql_createTables, null, function (tx, result) {
                    console.log(result);
                }, function (tx, error) {
                    console.log(error);
                });
            })
        }

        prepareDb();
    }
};

app.initialize();