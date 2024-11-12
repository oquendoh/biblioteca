const { register, login, updateUser, deleteUser } = require('./controllers/userController');
const { createBook, getBooks, updateBook, deleteBook } = require('./controllers/bookController');

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (token === '123456') {
        next();
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Acceso denegado, se requiere autenticación' }));
    }
}

function handleRequest(req, res) {
    const { url, method } = req;
    if (url === '/api/usuarios/register' && method === 'POST') {
        register(req, res);
    } else if (url === '/api/usuarios/login' && method === 'POST') {
        login(req, res);
    } else if (url.startsWith('/api/usuarios/') && method === 'PUT') {
        authMiddleware(req, res, () => updateUser(req, res));
    } else if (url.startsWith('/api/usuarios/') && method === 'DELETE') {
        authMiddleware(req, res, () => deleteUser(req, res));
    } else if (url === '/api/libros' && method === 'POST') {
        authMiddleware(req, res, () => createBook(req, res));
    } else if (url === '/api/libros' && method === 'GET') {
        getBooks(req, res);
    } else if (url.startsWith('/api/libros/') && method === 'PUT') {
        authMiddleware(req, res, () => updateBook(req, res));
    } else if (url.startsWith('/api/libros/') && method === 'DELETE') {
        authMiddleware(req, res, () => deleteBook(req, res));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
}

module.exports = { handleRequest };
