USE hcm_db;

INSERT INTO department (name)
VALUES
	("DEFAULT"),
    ("FINANCE"),
    ("HUMAN RESOURCES"),
    ("INFORMATION MANAGEMENT"),
    ("SALES"),
    ("LOGISTICS"),
    ("MARKETING");
    
INSERT INTO role (title, salary, department_id)
VALUES
    ("DEFAULT", 10000, 1),
	("Manager, Finance", 100000, 2),
    ("Financial Analyst", 65000, 2),
    ("Manager, HR", 90000, 3),
    ("HR Partner", 60000, 3),
    ("Manager, IT", 140000, 4),
    ("SQL Administrator", 90000, 4),
    ("Manager, Sales", 90000, 5),
    ("Inside Sales Representative", 50000, 5),
    ("Manager, Logistics", 100000, 6),
    ("Supply Chain Analyst", 70000, 6),
    ("Manager, Marketing", 90000, 7),
    ("Copy Editor", 55000, 7);
    
INSERT INTO employee (first_name, last_name, role_id)
VALUES
	("Default", "Manager", 1);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Clark", "Kent", 2, 1),
    ("Bruce", "Wayne", 4, 1),
    ("Hal", "Jordan", 6, 1 ),
    ("Diana", "Prince", 8, 1),
    ("Arthur", "Curry", 10, 1),
    ("Barry", "Allen", 12, 1),
	("Conner", "Kent", 3, 2),
    ("Dick", "Grayson", 5, 3),
    ("Kyro", "Young", 7, 4),
    ("Cassandra", "Sandsmark", 9, 5),
    ("Garth", "Aqua", 11, 6),
    ("Wally", "West", 13, 7);