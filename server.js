// ===DEPENDENCIES===
const mysql = require("mysql");
const inquirer = require("inquirer");

// ===CREATE SQL CONNECTION===
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "V!sionfor20202",
  database: "hcm_db",
});

// ===INITIAL CONNECTION TO DB===
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startStop();
});

async function startStop() {
  let continueProgram = true;

  while (continueProgram) {
    continueProgram = await directory();
  }

  connection.end();
  console.log("Bye.");
}

async function directory() {
  const { actionType, actionSelection } = await mainMenu();

  if (actionSelection === "goback") {
    return true;
  }

  switch (actionType) {
    case "view":
      viewOps(actionSelection);
      return true;
    case "update":
      updateOps();
      return true;
    case "add":
      addOps();
      return true;
    case "exit":
      console.log("Ending Session...");
      return false;
    default:
      console.log("Unexpected Error, Ending Session");
      return false;
  }
}

function viewOps(queryObject) {
  const queryStrings = {
    allDept: "SELECT * FROM department",
    allRole: "SELECT * FROM role",
    allEmp: "SELECT * FROM employee",
    empByMgr: "SELECT * FROM employee WHERE manager_id = ?",
    deptSal:
      "SELECT C.name, SUM(B.salary) FROM employee A INNER JOIN role B ON A.role_id = B.id INNER JOIN department C ON B.department_id = C.id GROUP BY B.department_id",
  };
  console.log("VIEW TABLES");
  console.log(queryStrings[queryObject.qString]);
  // inquirer.prompt([
  //     {
  //         type: "list",
  //         message: "View what table?",
  //         name: "tableRouter",
  //         choices: [
  //             { name: "Departments Table", value: "department" },
  //             { name: "Roles Table", value: "role" },
  //             { name: "Employees Table", value: "employee" }
  //         ]
  //     }
  // ]).then(({tableRouter}) => {
  //     connection.query(queryString + connection.escapeId(tableRouter), (err, data) => {
  //         if (err) throw err;
  //         console.table(data);
  //     });
  // });
}

function updateOps() {
  console.log("UPDATE TABLES");
}

function addOps() {
  console.log("ADD TO TABLES");
}

function mainMenu() {
  return inquirer.prompt([
    {
      type: "list",
      message: "Choose an operation:",
      choices: [
        { name: "View Existing Employees/Roles/Departments", value: "view" },
        {
          name: "Update Existing Employees/Roles/Departments",
          value: "update",
        },
        { name: "Add New Employees/Roles/Departments", value: "add" },
        { name: "Exit", value: "exit" },
      ],
      name: "actionType",
    },
    {
      when: skipOnExit,
      type: "list",
      message: "===========",
      choices: returnSubSelections,
      name: "actionSelection",
    },
  ]);
}

function returnSubSelections({ actionType }) {
  switch (actionType) {
    case "view":
      return [
        { name: "View: ALL Departments", value: { qString: "allDept" } },
        { name: "View: ALL Roles", value: { qString: "allRole" } },
        { name: "View: ALL Employees", value: { qString: "allEmp" } },
        {
          name: "View: ALL Employees by Manager",
          value: { qString: "empByMgr", qPrompt: "activeMgrs" },
        },
        {
          name: "View: Utilized Salary, by Department",
          value: { qString: "deptSal" },
        },
        { name: "Go Back", value: "goback" },
      ];
    case "update":
      return [
        { name: "Employee Update: New Role", value: "1" },
        { name: "Employee Update: New Manager", value: "2" },
        { name: "Delete: Department", value: "3" },
        { name: "Delete: Role", value: "4" },
        { name: "Delete: Employee", value: "5" },
        { name: "Go Back", value: "goback" },
      ];
    case "add":
      return [
        { name: "Add: NEW Employee", value: "1" },
        { name: "Add: NEW Role", value: "2" },
        { name: "Add: NEW Department", value: "3" },
        { name: "Go Back", value: "goback" },
      ];
  }
}

function skipOnExit({ actionType }) {
  if (actionType === "exit") {
    return false;
  } else {
    return true;
  }
}
