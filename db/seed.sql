INSERT INTO department (name)
VALUES
	("FINANCE"),
    ("HUMAN RESOURCES"),
    ("INFORMATION MANAGEMENT"),
    ("SALES"),
    ("LOGISTICS"),
    ("MARKETING");
    
INSERT INTO role (title, salary, department_id)
VALUES
	("Manager, Finance", 100000, 1),
    ("Financial Analyst", 65000, 1),
    ("Manager, HR", 90000, 2),
    ("HR Partner", 60000, 2),
    ("Manager, IT", 140000, 3),
    ("SQL Administrator", 90000, 3),
    ("Manager, Sales", 90000, 4),
    ("Inside Sales Representative", 50000, 4),
    ("Manager, Logistics", 100000, 5),
    ("Supply Chain Analyst", 70000, 5),
    ("Manager, Marketing", 90000, 6),
    ("Copy Editor", 55000, 6);
    
INSERT INTO employee (first_name, last_name, role_id)
VALUES
	("Clark", "Kent", 1),
    ("Bruce", "Wayne", 3),
    ("Hal", "Jordan", 5),
    ("Diana", "Prince", 7),
    ("Arthur", "Curry", 9),
    ("Barry", "Allen", 11);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
	("Conner", "Kent", 2, 1),
    ("Dick", "Grayson", 4, 2),
    ("Kyro", "Young", 6, 3),
    ("Cassandra", "Sandsmark", 8, 4),
    ("Garth", "Aqua", 10, 5),
    ("Wally", "West", 12, 6);