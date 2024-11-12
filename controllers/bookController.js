const { readDatabase, writeDatabase } = require('../db');

function createBook(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const book = JSON.parse(body);
        books.push(book);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Libro creado', book }));
    });
}

function getBooks(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ books }));
}

function updateBook(req, res) {
    const bookId = req.url.split('/').pop();
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const updatedData = JSON.parse(body);
        const db = readDatabase();
        const bookIndex = db.books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            db.books[bookIndex] = { ...db.books[bookIndex], ...updatedData };
            writeDatabase(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Libro actualizado', book: db.books[bookIndex] }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Libro no encontrado' }));
        }
    });
}

function deleteBook(req, res) {
    const bookId = req.url.split('/').pop();
    const db = readDatabase();
    const bookIndex = db.books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        db.books[bookIndex].disabled = true;
        writeDatabase(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Libro inhabilitado' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Libro no encontrado' }));
    }
}

module.exports = { createBook, getBooks, updateBook, deleteBook };
