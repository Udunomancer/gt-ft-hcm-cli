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
      await updateOps(actionSelection).then(data => console.log(data), err => console.log(err));
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

async function viewOps(queryObject) {
  const queryStrings = {
    allDept: "SELECT * FROM department",
    allRole: "SELECT * FROM role",
    allEmp: "SELECT * FROM employee",
    empByMgr: "SELECT * FROM employee WHERE manager_id = ?",
    deptSal:
      "SELECT C.name, SUM(B.salary) FROM employee A LEFT JOIN role B ON A.role_id = B.id LEFT JOIN department C ON B.department_id = C.id GROUP BY B.department_id",
  };

  return new Promise(async function(resolve, reject) {
    if (queryObject.qString === "empByMgr") {
      let mgrChoices = await getManagerForPrompt();
      inquirer.prompt([
        {
          type: "list",
          choices: mgrChoices,
          message: "View Employees under which Manager?",
          name: "manager"
        }
      ]).then(function(err, data) {
        if(err)
          return reject(err);
        connection.query("SELECT * FROM employee WHERE manager_id = ?", data.manager, function(err, request) {
          if (err)
            return reject(err);
          resolve(request);
        });
      });
    } else {
      connection.query(queryStrings[queryObject.qString], function(err, data) {
        if(err)
          return reject(err);
        resolve(data);
      });
    }
  });
}

async function updateOps({qString, qPrompt}) {
  
  let empChoices;
  let roleChoices;
  let deptChoices;

  if (qPrompt === "empNewRole" || qPrompt === "empNewMgr") {
    empChoices = await getManagerForPrompt();
  }
  if (qPrompt === "empNewRole" || qPrompt === "delRole") {
    roleChoices = await getRoleForPrompt();
  }
  if (qPrompt === "delDept") {
    deptChoices = await getDeptForPrompt();
  }

  return new Promise(function(resolve, reject) {
    
    inquirer.prompt([
      {
        when: qPrompt === "empNewRole" || qPrompt === "empNewMgr",
        type: "list",
        message: "What Employee would you like to edit?",
        choices: empChoices,
        name: "employee"
      },{
        when: qPrompt === "empNewRole",
        type: "list",
        message: "Select new Role",
        choices: roleChoices,
        name: "empRole"
      },{
        when: qPrompt === "empNewMgr",
        type: "list",
        message: "Select new Manager",
        choices: empChoices,
        name: "manager"
      },{
        when: qPrompt === "delDept",
        type: "list",
        message: "Select Department to Delete",
        choices: deptChoices,
        name: "dept"
      },{
        when: qPrompt === "delRole",
        type: "list",
        message: "Select Role to Delete",
        choices: roleChoices,
        name: "role"
      },{
        when: qPrompt === "delEmp",
        type: "list",
        message: "Select Employee to Delete",
        choices: empChoices,
        name: "delEmp"
      }
    ]).then(function(response, err) {
      if(err)
        return reject(err);

      let keys = [];
      let values = [];
      for (const [key, value] of Object.entries(response)) {
        keys.push(key);
        values.push(value);
      }
      connection.query(qString, [keys, values], function(err, data) {
        if (err)
          return reject(err);
        resolve(data);
      })
    })
  })
}

async function addOps({qString, qPrompt}) {
  
  let mgrChoices;
  let roleChoices;
  let deptChoices;
  if (qPrompt === "addEmp") {
    mgrChoices = await getManagerForPrompt();
    roleChoices = await getRoleForPrompt();
  }
  if (qPrompt === "addRole") {
    deptChoices = await getDeptForPrompt();
  }

  return new Promise(function(resolve, reject) {
    inquirer.prompt([
      {
        when: qPrompt === "addEmp",
        type: "input",
        message: "First Name of employee to INSERT?",
        name: "first_name"
      },{
        when: qPrompt === "addEmp",
        type: "input",
        message: "Last Name of employee to INSERT?",
        name: "last_name"
      },{
        when: qPrompt === "addEmp",
        type: "list",
        choices: roleChoices,
        message: "Role of Employee to INSERT?",
        name: "role_id"
      },{
        when: qPrompt === "addEmp",
        type: "list",
        choices: mgrChoices,
        message: "Manager of Employee to INSERT?",
        name: "manager_id"
      },{
        when: qPrompt === "addRole",
        type: "input",
        message: "Title of Role to INSERT?",
        name: "title"
      },{
        when: qPrompt === "addRole",
        type: "number",
        message: "Salary of Role to INSERT?",
        name: "salary"
      },{
        when: qPrompt === "addRole",
        type: "list",
        choices: deptChoices,
        message: "Department of Role to INSERT?",
        name: "department_id"
      },{
        when: qPrompt === "addDept",
        type: "input",
        message: "Name of department to INSERT?",
        name: "name"
      }
    ]).then(function(response, err) {
      if(err)
        return reject(err);

      let keys = [];
      let values = [];
      for (const [key, value] of Object.entries(response)) {
        keys.push(key);
        values.push(value);
      }
      connection.query(qString, [keys, values], function(err, data) {
        if (err)
          return reject(err);
        resolve(data);
      })
    });
  });
}

function getManagerForPrompt() {
  return new Promise(function(resolve, reject) {
    let choices = [];
    connection.query("SELECT id, first_name, last_name FROM employee", function(err, data) {
      if(err)
        return reject(err);
      for(let i = 0; i < data.length; i++) {
        choices.push({name: data[i].first_name + " " + data[i].last_name, value: data[i].id});
      }
      resolve(choices);
    });
    
  })
}

function getRoleForPrompt() {
  return new Promise(function(resolve, reject) {
    let choices = [];
    connection.query("SELECT id, title FROM role", function(err, data) {
      if(err)
        return reject(err);
      for(let i = 0; i < data.length; i++) {
        choices.push({name: data[i].title, value: data[i].id});
      }
      resolve(choices);
    });
  });
}

function getDeptForPrompt() {
  return new Promise(function(resolve, reject) {
    let choices = [];
    connection.query("SELECT id, name FROM department", function(err, data) {
      if(err)
        return reject(err);
      for(let i = 0; i < data.length; i++) {
        choices.push({name: data[i].name, value: data[i].id});
      }
      resolve(choices);
    });
  });
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
          value: { qString: "empByMgr" },
        },
        {
          name: "View: Utilized Salary, by Department",
          value: { qString: "deptSal" },
        },
        { name: "Go Back", value: "goback" },
      ];
    case "update":
      return [
        { name: "Employee Update: New Role", value: {qString: "UPDATE employee SET role_id = ? WHERE id = ?", qPrompt: "empNewRole"} },
        { name: "Employee Update: New Manager", value: {qString: "UPDATE employee SET manager_id = ? WHERE id = ?", qPrompt: "empNewMgr"} },
        { name: "Delete: Department", value: {qString: "DELETE FROM department WHERE id = ?", qPrompt: "delDept"} },
        { name: "Delete: Role", value: {qString: "DELETE FROM role WHERE id = ?", qPrompt: "delRole"} },
        { name: "Delete: Employee", value: {qString: "DELETE FROM employee WHERE id = ?", qPrompt: "delEmp"} },
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
