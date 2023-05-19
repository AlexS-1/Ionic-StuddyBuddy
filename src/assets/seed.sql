CREATE TABLE IF NOT EXISTS developer(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
INSERT or IGNORE INTO developer VALUES (1, 'Simon', 'Capacitor, Cordova', 'https://i.pravatar.cc/400?u=user7');
INSERT or IGNORE INTO developer VALUES (2, 'Max', 'Ionic', 'https://i.pravatar.cc/400?u=user8');
INSERT or IGNORE INTO developer VALUES (3, 'Ben', 'React, Angular', 'https://i.pravatar.cc/400?u=user15');

CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (1, 'Ionic Academy', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (2, 'Software Startup Manual', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (3, 'Ionic Framework', 2);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (4, 'Drifty Co', 2);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (5, 'Angular Academy', 3);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (6, 'Ionicons', 3);
