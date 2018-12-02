// ===========
// Port
// ===========

process.env.PORT = process.env.PORT || 3000;

// ==========
// Environment
// ==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========
// Database
// ==========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:idkfa182@ds231549.mlab.com:31549/cafe';
}

process.env.URLDB = urlDB;