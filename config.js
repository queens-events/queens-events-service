module.exports = {
    directory: __dirname,
    debug: {
        active: process.env.NODE_ENV === 'dev',
        environment: process.env.NODE_ENV,
        level: process.env.DEBUG_LEVEL || 'info'
    },
    webServer: {
        port: process.env.WEB_PORT || '1337',
    },
    database: {
        credentials: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        schemaName: process.env.DB_SCHEMA_NAME,
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'mysql',
        port: process.env.DB_PORT || 3306,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
        // Sqlite Store only
        storage: process.env.DB_SQLITE_LOCATION || './database/db.sqlite',
        logging: false
    }
};