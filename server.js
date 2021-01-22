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
      await viewOps(actionSelection).then(data => console.table(data), err => console.log(err));
      return true;
    case "update":
      await updateOps();
      return true;
    case "add":
      await addOps(actionSelection).then(data => console.log(data), err => console.log(err));
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
      "SELECT C.name, SUM(B.salary) FROM employee A LEFT JOIN role B ON A.role_id = B.id LEFT JOIN department C ON B.department_id = C.id GROUP BY B.department_id",
  };
  
  return new Promise(function(resolve, reject) {
    connection.query(queryStrings[queryObject.qString], function(err, data) {
      if(err)
        return reject(err);
      resolve(data);
    });
  });
}

function updateOps(queryObject) {
  console.log(queryObject.qString);
  console.log(queryObject.qPrompt);
  console.log("UPDATE TABLES");
}

function addOps(queryObject) {
  
  return new Promise(function(resolve, reject) {
    inquirer.prompt([
      {
        when: queryObject.qPrompt === "addEmp",
        type: "input",
        message: "First Name of employee to INSERT?",
        name: "empFirstName"
      },{
        when: queryObject.qPrompt === "addEmp",
        type: "input",
        message: "Last Name of employee to INSERT?",
        name: "empLastName"
      },{
        when: queryObject.qPrompt === "addEmp",
        type: "list",
        choices: ["EmpTEST1", "EmpTEST2"],
        message: "Role of Employee to INSERT?",
        name: "empRole"
      },{
        when: queryObject.qPrompt === "addEmp",
        type: "input",
        message: "Manager of Employee to INSERT?",
        name: "empMgr"
      },{
        when: queryObject.qPrompt === "addRole",
        type: "input",
        message: "Title of Role to INSERT?",
        name: "roleTitle"
      },{
        when: queryObject.qPrompt === "addRole",
        type: "number",
        message: "Salary of Role to INSERT?",
        name: "roleSal"
      },{
        when: queryObject.qPrompt === "addRole",
        type: "list",
        choices: ["Role1", "Role2"],
        message: "Department of Role to INSERT?",
        name: "roleDept"
      },{
        when: queryObject.qPrompt === "addDept",
        type: "input",
        message: "Name of department to INSERT?",
        name: "dept"
      }
    ]).then(function(response, err) {
      if(err)
        return reject(err);
      resolve(response);
    });
  });
  // inquirer.prompt([
  //   {
  //     type: "input",
  //     message: "Name of department to INSERT?",
  //     name: "dept"
  //   }
  // ]).then((response) => {
  //   connection.query(queryObject.qString, response.dept, function(err, data) {
  //     if(err)
  //       return err;
  //     console.log("Department Added");
  //   })
  // })
  // console.log(queryObject.qString);
  // console.log(queryObject.qPrompt);
  // console.log("ADD TO TABLES");
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
      message: "==================",
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
        { name: "Add: NEW Employee", value: { qString: "INSERT INTO employee (??) VALUES (?)", qPrompt: "addEmp"} },
        { name: "Add: NEW Role", value: { qString: "INSERT INTO role (??) VALUES (?)", qPrompt: "addRole" } },
        { name: "Add: NEW Department", value: { qString: "INSERT INTO department (??) VALUES (?)", qPrompt: "addDept" } },
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
