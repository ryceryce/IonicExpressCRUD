var express = require("express");
var app = express();
var db = require("./database.js");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 3000

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// main page
app.get("/", (req, res, next) => {
    res.json({
        "message": "OK",
    });
});

// Get All Data
app.get("/items", (req, res, next) => {
    var sql = "SELECT * FROM items";
    var params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        } else {
            res.json({
                "message": "succcess",
                "data": rows
            });
        }
    });
});


//Get Data selected by ID
app.get("/items/:id", (req, res, next) => {
    var sql = "SELECT * FROM items WHERE id = ?";
    var params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        } else {
            res.json({
                "message": "success",
                "data": row
            })
        }
    });
});


//Insert new data
app.post("/new", (req, res, next) => {
    var ts = Date.now();
    var date_ob = new Date(ts);
    var date = date_ob.getDate();
    var month = date_ob.getMonth() + 1;
    var year = date_ob.getFullYear();

    var error = [];
    var data = {
        item: req.body.item,
        amount: req.body.amount,
        update_on: `${date}-${month}-${year}`
    };
    var sql = 'INSERT INTO items (item, amount, update_on) VALUES (?,?,?)';
    var params = [data.item, data.amount, data.update_on];

    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        } else {
            res.json({
                "message": "success",
                "data": data,
                "id": this.lastID
            });
        }
    });
});

//Update data
app.patch("/items/:id", (req, res, next) => {
    var ts = Date.now();
    var date_ob = new Date(ts);
    var date = date_ob.getDate();
    var month = date_ob.getMonth() + 1;
    var year = date_ob.getFullYear();

    var data = {
        item: req.body.item,
        amount: req.body.amount,
        update_on: `${date}-${month}-${year}`,
        id: req.params.id
    };
    var sql = 'UPDATE items set item = COALESCE(?,item), amount = COALESCE(?,amount), update_on = COALESCE(?,update_on) WHERE id = ?';
    var params = [data.item, data.amount, data.update_on, data.id];

    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            console.log(err.message);
            return;
        } else {
            res.json({
                message: "success",
                data: data,
                change: this.changes
            })
        }
    });
});

//Delete Data
app.delete("/items/:id", (req, res, next) => {
    sql = 'DELETE FROM items WHERE id = ?';
    params = [req.params.id];

    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        } else {
            res.json({
                message: "deleted",
                change: this.changes
            });
        }
    });
});

app.use(function(req, res) {
    res.status(404);
});