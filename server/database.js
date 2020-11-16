var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        //Cannot open database
        console.log(err.message);
        throw err;
    } else {
        console.log('Connected to SQLite Database');
        db.run(`CREATE TABLE items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item text UNIQUE,
            amount INTEGER,
            update_on DATE
        )`,
            (err) => {
                if (err) {
                    console.log("Table already created");
                    console.log(err.message);
                } else {
                    console.log("Table just created, creating some rows");

                    // var insert = 'INSERT INTO items (item, amount) VALUES (?,?)';
                    // db.run(insert, ["mangga", 2]);
                    // db.run(insert, ["melon", 5]);
                }
            });
    }
});

module.exports = db;