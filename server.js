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
    const queryString = "SELECT * FROM ";
    inquirer.prompt([
        {
            type: "list",
            message: "View what table?",
            name: "tableRouter",
            choices: [
                { name: "Departments Table", value: "department" },
                { name: "Roles Table", value: "role" },
                { name: "Employees Table", value: "employee" }
            ]
        }
    ]).then(({tableRouter}) => {
        connection.query(queryString + connection.escapeId(tableRouter), (err, data) => {
            if (err) throw err;
            console.table(data);
        });
    });
}