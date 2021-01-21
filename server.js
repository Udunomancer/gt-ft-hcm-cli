// ===DEPENDENCIES===
const mysql = require("mysql");
const inquirer = require("inquirer");

// ===CREATE SQL CONNECTION===
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "V!sionfor20202",
    database: "hcm_db"
});

// ===INITIAL CONNECTION TO DB===
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    viewTable();
})

function viewTable() {
    connection.query("SELECT * FROM department;", (err, data) => {
        if (err) throw err;
        console.table(data);
    });
}