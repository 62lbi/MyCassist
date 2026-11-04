// --- Project Description
  * Project name: MyCassist (My Cash Assistant)
  * Purpose: An API that 'assists' an user's monthly income tracking, budgeting based on manual calculation from the user itself by percentage 
          (using an external ai to calculate for the budgeting is recommended for time efficiency) and an expense tracking for the user to know what they're spending on.

// --- Libraries that are used for this API/project & Application
  * Node.js
  * Express.js
  * Sequelize ORM
  * MySQL & mysql2
  * Nodemon
  * cors
  * phpMyAdmin (Laragon)
  * Postman

// --- Installation & Usage Guide
  1. Open Visual Studio Code (VSCode)
  2. Make sure you're logged in github account that you own, if you havent yet (optional)
  3. Type "git clone https://github.com/62lbi/MyCassist.git" in your terminal and enter
  4. After successfully cloning, still in your terminal; type "cd MyCassist" and enter (you will know that you changed directory if your terminal has these; "/MyCassist")
  5. Within the MyCassist folder that successfuly cloned; type "npm install" in terminal, enter and wait for it to finish
  6. Still in the terminal, type; 'npm install --save-dev nodemon'
  7. Boot up laragon, and ONLY turn on Apache 2.4.66 and MySQL 8.4.3
  8. Still in Laragon app, click 'Database' GUI inside and login in the phpMyAdmin (the default is user ROOT and no password, leave it blank)
  9. Create a new database called 'mycassist_db'
  10. Go back to vscode and open the terminal, still within the "/MyCassist" directory, type; "npx sequelize-cli db:migrate" (make sure that you already checked/made the config/config.json the same as below)
  11. The server port default is '3433', you can change it by following the Environment Configuration steps
  12. Use the terminal (within the "/MyCassist' directory, type; 'node index.js'

  
// --- Environment Configuration
 * Open config/config.json, there is going to be 3 type of things;
  development, test, production
  we're only going to change the development here, so make sure its like these;
{
    "development": {
        "username": "root",
        "password": null,
        "database": "mycassist_db",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
  * the server port is going to be running on '3433', you could change it to however you'd like in index.js (root folder) find the line of code that has
  * 'const PORT = 3433' and only change the value of const PORT = .. <---

  // --- Endpoint Documentation
    For the complete API endpoint documentation, including
    request bodies, response examples, and Postman testing screenshots,
    please visit:
    https://docs.google.com/document/d/1ANVOLIXlVM631twfKnI2CtFy7CVqvBTLgXWNxe3HgE0/edit?usp=sharing

  
