// ===========
// Port
// ===========

process.env.PORT = process.env.PORT || 3000;

// ==========
// Environment
// ==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// token expiration
// =====================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ======================
// SEED authentication
// ======================

// the first seed is in case that heroku already has setted this environment variable
process.env.SEED = process.env.SEED || 'this-is-seed-dev';

// ==========
// Database
// ==========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;