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
    init();
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

function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an operation:",
            choices: [
                "View Existing Employees/Roles/Departments",
                "Update Existing Employees/Roles/Departments",
                "Add New Employees/Roles/Departments",
                "Exit"
            ],
            name: "actionType"
        },{
            when: skipOnExit,
            type: "list",
            message: "===========",
            choices: returnSubSelections,
            name: "actionSelection"
        }
    ]).then((answers) => {
            console.log(answers);
    });
}

function returnSubSelections({actionType}) {
    switch (actionType) {
        case "View Existing Employees/Roles/Departments":
            return [
                { name: "View: ALL Departments", value: "1" },
                { name: "View: ALL Roles", value: "2" },
                { name: "View: ALL Employees", value: "3" },
                { name: "View: ALL Employees by Manager", value: "4" },
                { name: "View: Utilized Salary, by Department", value: "5" },
                { name: "Go Back", value: "6" }
            ]
        case "Update Existing Employees/Roles/Departments":
            return [
                { name: "Employee Update: New Role", value: "1" },
                { name: "Employee Update: New Manager", value: "2" },
                { name: "Delete: Department", value: "3" },
                { name: "Delete: Role", value: "4" },
                { name: "Delete: Employee", value: "5" },
                { name: "Go Back", value: "6" }
            ]
        case "Add New Employees/Roles/Departments":
            return [
                { name: "Add: NEW Employee", value: "1" },
                { name: "Add: NEW Role", value: "2" },
                { name: "Add: NEW Department", value: "3" },
                { name: "Go Back", value: "4" }
            ]
    }
}

function skipOnExit({actionType}) {
    if (actionType === "Exit") {
        return false;
    } else {
        return true;
    }
}

function exit() {
    connection.end();
}