const fs = require('fs');
const path = require('path');
const databasePath = path.join(__dirname, 'db.json');

function readDatabase() {
    try {
        const data = fs.readFileSync(databasePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer la base de datos:", error);
        return { users: [], books: [] };
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al escribir en la base de datos:", error);
    }
}

module.exports = {readDatabase, writeDatabase};