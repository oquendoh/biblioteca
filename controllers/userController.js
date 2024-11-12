const { readDatabase, writeDatabase } = require('../db');

function register(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const newUser = JSON.parse(body);
        const db = readDatabase();
        db.users.push(newUser);
        writeDatabase(db);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Usuario registrado', user: newUser }));
    });
}

function login(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const { email, password } = JSON.parse(body);
        const db = readDatabase();
        const user = db.users.find(u => u.email === email && u.password === password);
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login exitoso', token: '123456' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Credenciales incorrectas' }));
        }
    });
}

function updateUser(req, res) {
    const userId = req.url.split('/').pop();
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const updatedData = JSON.parse(body);
        const db = readDatabase();
        const userIndex = db.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            db.users[userIndex] = { ...db.users[userIndex], ...updatedData };
            writeDatabase(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Usuario actualizado', user: db.users[userIndex] }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
        }
    });
}

function deleteUser(req, res) {
    const userId = req.url.split('/').pop();
    const db = readDatabase();
    const userIndex = db.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        db.users[userIndex].disabled = true;
        writeDatabase(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Usuario inhabilitado' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
    }
}

module.exports = { register, login, updateUser, deleteUser };
